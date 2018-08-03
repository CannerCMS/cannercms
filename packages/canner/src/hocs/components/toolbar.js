// @flow

import * as React from 'react';
import {get} from 'lodash';
import DefaultToolbarLayout from './toolbarlayout';
import Pagination from './pagination';
import Sort from './sort';
import Filter from './filter';
import isObject from 'lodash/isObject';
import type {Query} from '../../query';
import type RefId from 'canner-ref-id';

type Args = {
  pagination: {
    first?: number,
    after?: string
  },
  where?: Object,
  orderBy?: string,
  updateQuery: Function
}

type Props = {
  children: React.Node,
  updateQuery: Function,
  toolbar: {
    sort?: {
      component?: React.ComponentType<*>,
      [string]: *
    },
    pagination?: {
      component?: React.ComponentType<*>,
      [string]: *
    },
    filter?: {
      component?: React.ComponentType<*>,
      [string]: *
    },
    toolbarLayout?: {
      component?: React.ComponentType<*>,
      [string]: *
    }
  },
  query: Query,
  refId: RefId,
  args: Args,
  items: Object,
  value: Object,
  onChange?: Function
}

export default class Toolbar extends React.PureComponent<Props> {

  constructor(props: Props) {
    super(props);
  }

  UNSAFE_componentWillReceiveProps(props: Props) {
    const {onChange, value} = props;
    if (onChange && value) {
      onChange(value);
    }
  }

  changeOrder = ({orderField, orderType}: {orderField: string, orderType: string}) => {
    const {updateQuery, refId, args} = this.props;
    updateQuery(refId.getPathArr(), {first: 10, orderBy: `${orderField}_${orderType}`, where: args.where});
  }

  changeFilter = (where: Object) => {
    const {updateQuery, refId, args} = this.props;
    const validWhere = processWhere(where);
    updateQuery(refId.getPathArr(), {first: 10, orderBy: args.orderBy, where: validWhere});
  }

  nextPage = () => {
    const {updateQuery, args, value, refId} = this.props;
    if (get(value, ['pageInfo', 'hasNextPage'])) {
      const {first = 10} = parsePagination(args);
      const after = value.edges.slice(-1)[0].cursor;
      updateQuery(refId.getPathArr(), {
        ...args, 
        first,
        after,
        last: undefined,
        before: undefined
      });
    }
  }

  prevPage = () => {
    const {updateQuery, args, value, refId} = this.props;
    if (get(value, ['pageInfo', 'hasPreviousPage'])) {
      const {last = 10} = parsePagination(args);
      const before = get(value, ['edges', 0, 'cursor']);
      updateQuery(refId.getPathArr(), {
        ...args,
        last,
        before,
        after: undefined,
        first: undefined
      });
    }
  }

  changeSize = (size: number) => {
    const {value, updateQuery, args, refId} = this.props;
    const pagination = parsePagination(args);
    if ('last' in pagination) {
      updateQuery(refId.getPathArr(), {
        ...args,
        last: size,
        before: pagination.before || get(value, ['edges', 0, 'cursor']),
        after: undefined,
        first: undefined
      });
    } else {
      updateQuery(refId.getPathArr(), {
        ...args,
        first: size,
        after: pagination.after || (value.edges.slice(-1)[0] || {}).cursor,
        last: undefined,
        before: undefined
      });
    }
  }

  render() {
    const {children, toolbar = {}, args, items, value} = this.props;
    const {sort, pagination, filter, toolbarLayout} = toolbar;
    const ToolbarLayout = toolbarLayout && toolbarLayout.component ? toolbarLayout.component : DefaultToolbarLayout;
    const SortComponent = sort && sort.component ? sort.component : Sort;
    const FilterComponent = filter && filter.component ? filter.component : Filter;
    const PaginationComponent = pagination && pagination.component ? pagination.component : Pagination;
    const {orderField, orderType} = parseOrder(args.orderBy);
    const where = parseWhere(args.where || {});
    const {first, last} = parsePagination(args);
    return <ToolbarLayout
      Sort={sort ? <SortComponent
        {...sort}
        defaultSort={sort.defaultSort}
        options={sort.options}
        changeOrder={this.changeOrder}
        orderField={orderField}
        orderType={orderType}
        items={items}
      /> : null}
      Pagination={pagination ? <PaginationComponent
        {...pagination}
        hasNextPage={get(value, ['pageInfo', 'hasNextPage'])}
        hasPreviousPage={get(value, ['pageInfo', 'hasPreviousPage'])}
        nextPage={this.nextPage}
        prevPage={this.prevPage}
        changeSize={this.changeSize}
        size={first || last}
      /> : null}
      Filter={filter ? <FilterComponent
        {...filter}
        items={items}
        where={where}
        changeFilter={this.changeFilter}
      /> : null}
    >
      {React.Children.only(children)}
    </ToolbarLayout>
  }
}

export function parseOrder(orderBy: ?string): {orderField: string | null, orderType: 'ASC' | 'DESC'} {
  if (typeof orderBy === 'string') {
    const [orderField, orderType] = orderBy.split('_');
    if (orderType !== 'ASC' && orderType !== 'DESC') {
      return {orderField, orderType: 'ASC'};
    }
    return {orderField, orderType};
  }
  return {
    orderField: null,
    orderType: 'ASC'
  };
}

export function parsePagination(args: Object = {}) {
  return {
    first: args.first,
    after: args.after,
    last: args.last,
    before: args.before
  }
}

export function parseWhere(where: Object) {
  return Object.keys(where).reduce((result: Object, key: string) => {
    const v = where[key];
    const type = typeof v;
    const [field, op] = key.split('_');
    if (type === 'string') {
      result[field] = {eq: v};
    }

    if (type === 'boolean') {
      result[field] = {eq: v};
    }

    if (type === 'number') {
      result[field] = {[op || 'eq']: v};
    }

    if (type === 'object') {
      result[field] = parseWhere(v);
    }
    return result;
  }, {});
}

export function processWhere(where: Object)  {
  return Object.keys(where).reduce((result: Object, key: string) => {
    const v = where[key];
    if (isEnd(v)) {
      const {op, value} = parseOpAndValue(v);
      result[`${key}_${op}`] = value;
    } else {
      result[key] = processWhere(v);
    }

    return result;
  }, {});
}

function isEnd(v: Object) {
  if (!isObject(v)) {
    return false;
  }

  const keys = Object.keys(v);
  const value = v[keys[0]];
  return keys.length === 1 &&
    ['lt', 'lte', 'gt', 'gte', 'eq'].indexOf(keys[0]) !== -1 &&
    (typeof value === 'string' ||
    typeof value === 'boolean' ||
    typeof value === 'number');
}

function parseOpAndValue(v: Object) {
  const op = Object.keys(v)[0];
  const value = v[op];
  return {
    op,
    value
  }
}
