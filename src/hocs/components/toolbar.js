// @flow

import * as React from 'react';
import DefaultToolbarLayout from './toolbarlayout';
import Pagination from './pagination';
import Sort from './sort';
import Filter from './filter';
import isObject from 'lodash/isObject';
import {Map} from 'immutable';
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
  value: Object
}

export default class Toolbar extends React.PureComponent<Props> {

  constructor(props: Props) {
    super(props);
  }

  changeOrder = ({orderField, orderType}: {orderField: string, orderType: string}) => {
    const {updateQuery, refId, args} = this.props;
    updateQuery(refId.getPathArr(), {...args, orderBy: `${orderField}_${orderType}`});
  }

  changeFilter = (where: Object) => {
    const {updateQuery, refId, args} = this.props;
    const validWhere = processWhere(where);
    updateQuery(refId.getPathArr(), {...args, where: validWhere});
  }

  nextPage = () => {
    const {updateQuery, args, value, refId} = this.props;
    if (value.getIn(['pageInfo', 'hasNextPage'])) {
      const {first = 10} = parsePagination(args);
      const after = value.get('edges').last().get('cursor');
      updateQuery(refId.getPathArr(), {...args, pagination: {
        first,
        after
      }});
    }
  }

  prevPage = () => {
    const {updateQuery, args, value, refId} = this.props;
    if (value.getIn(['pageInfo', 'hasPreviousPage'])) {
      const {last = 10} = parsePagination(args);
      const before = value.getIn(['edges', 0, 'cursor']);
      updateQuery(refId.getPathArr(), {...args, pagination: {
        last,
        before
      }});
    }
  }

  changeSize = (size: number) => {
    const {value, updateQuery, args, refId} = this.props;
    const pagination = parsePagination(args.pagination);
    if ('last' in pagination) {
      updateQuery(refId.getPathArr(), {...args, pagination: {
        last: size,
        before: pagination.before || value.getIn(['edges', 0, 'cursor'])
      }});
    } else {
      updateQuery(refId.getPathArr(), {...args, pagination: {
        first: size,
        after: pagination.after || (value.get('edges').last() || new Map()).get('cursor')
      }});
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
    const {where} = parseWhere(args.where || {});
    const {first, last} = parsePagination(args.pagination);
    return <ToolbarLayout
      Sort={sort ? <SortComponent
        {...sort}
        options={sort.options}
        changeOrder={this.changeOrder}
        orderField={orderField}
        orderType={orderType}
        items={items}
      /> : null}
      Pagination={pagination ? <PaginationComponent
        {...pagination}
        hasNextPage={value.getIn(['pageInfo', 'hasNextPage'])}
        hasPreviousPage={value.getIn(['pageInfo', 'hasPreviousPage'])}
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

export function parsePagination(pagination: Object) {
  return pagination || {};
}

export function parseWhere(where: Object) {
  return Object.keys(where).reduce((result, key) => {
    const v = where[key];
    const type = typeof v;
    const [field, op] = key.split('_');
    if (type === 'string') {
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
  return Object.keys(where).reduce((result, key) => {
    const v = where[key];
    if (isEnd(v)) {
      const {op, value} = parseOpAndValue(v);
      result[`${key}_${op}`] = value;
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
