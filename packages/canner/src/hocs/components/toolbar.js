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
    async: boolean,
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
    const {args, toolbar, originRootValue, parseConnectionToNormal, getValue, refId} = props;
    this.async = props.toolbar.async;
    this.state = {
      originRootValue,
      sort: parseOrder(args.orderBy),
      filter: parseWhere(args.where),
      pagination: parsePagination(args)
    };
  }

  static getDerivedStateFromProps(nextProps: Props, nextState: State) {
    const {originRootValue, args} = nextProps;
    return {
      originRootValue,
      sort: parseOrder(args.orderBy),
      filter: parseWhere(args.where),
      pagination: parsePagination(args)
    };
  }

  changeOrder = ({orderField, orderType}: {orderField: string, orderType: string}) => {
    const {toolbar, updateQuery, refId, args} = this.props;
    if (this.async) {
      updateQuery(refId.getPathArr(), {first: 10, orderBy: `${orderField}_${orderType}`, where: args.where});
    } else {
      this.setState({
        sort: {
          orderField,
          orderType
        }
      });
    }
  }

  changeFilter = (where: Object) => {
    const {updateQuery, refId, args} = this.props;
    if (this.async) {
      updateQuery(refId.getPathArr(), {first: 10, orderBy: args.orderBy, where: processWhere(where)});
    } else {
      this.setState({
        where
      });
    }
  }

  nextPage = () => {
    const {updateQuery, args, refId, keyName} = this.props;
    const {originRootValue, pagination} = this.state;
    if (get(originRootValue, [keyName, 'pageInfo', 'hasNextPage'])) {
      const after = originRootValue[keyName].edges.slice(-1)[0].cursor; // the last one
      updateQuery(refId.getPathArr(), {
        ...args, 
        first: pagination.first || 10,
        after,
        last: undefined,
        before: undefined
      });
    }
  }

  prevPage = () => {
    const {updateQuery, args, refId, keyName} = this.props;
    const {originRootValue, pagination} = this.state;
    if (get(originRootValue, [keyName, 'pageInfo', 'hasPreviousPage'])) {
      const before = get(originRootValue, [keyName, 'edges', 0, 'cursor']); // the first one
      updateQuery(refId.getPathArr(), {
        ...args,
        last: pagination.last || 10,
        before,
        after: undefined,
        first: undefined
      });
    }
  }

  changeSize = (size: number) => {
    const {updateQuery, args, refId} = this.props;
    const pagination = parsePagination(args);
    if (pagination.last) {
      updateQuery(refId.getPathArr(), {
        ...args,
        last: size
      });
    } else {
      updateQuery(refId.getPathArr(), {
        ...args,
        first: size
      });
    }
  }

  render() {
    const {children, toolbar = {}, args, refId, items, defaultValue, parseConnectionToNormal, getValue} = this.props;
    const {originRootValue} = this.state;
    const {sort, pagination, filter, toolbarLayout} = toolbar;
    const ToolbarLayout = toolbarLayout && toolbarLayout.component ? toolbarLayout.component : DefaultToolbarLayout;
    const SortComponent = sort && sort.component ? sort.component : Sort;
    const FilterComponent = filter && filter.component ? filter.component : Filter;
    const PaginationComponent = pagination && pagination.component ? pagination.component : Pagination;
    const {orderField, orderType} = parseOrder(args.orderBy);
    const where = parseWhere(args.where || {});
    const {first, last} = parsePagination(args);
    const rootValue = parseConnectionToNormal(originRootValue);
    const value = getValue(originRootValue, refId.getPathArr());
    return <ToolbarLayout
      Sort={sort ? <SortComponent
        {...sort}
        async={toolbar.async}
        defaultSort={sort.defaultSort}
        options={sort.options}
        changeOrder={this.changeOrder}
        orderField={orderField}
        orderType={orderType}
        items={items}
      /> : null}
      Pagination={pagination ? <PaginationComponent
        {...pagination}
        async={toolbar.async}
        hasNextPage={get(value, ['pageInfo', 'hasNextPage'])}
        hasPreviousPage={get(value, ['pageInfo', 'hasPreviousPage'])}
        nextPage={this.nextPage}
        prevPage={this.prevPage}
        changeSize={this.changeSize}
        size={first || last}
      /> : null}
      Filter={filter ? <FilterComponent
        async={toolbar.async}
        {...filter}
        items={items}
        where={where}
        changeFilter={this.changeFilter}
      /> : null}
    >
      {React.cloneElement(children, {
        rootValue,
        value: value ? get(value, 'edges', []).map(item => item.node) : defaultValue('array')
      })}
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
      result[field] = {[op || 'eq']: v};
    }

    if (type === 'boolean') {
      result[field] = {[op || 'eq']: v};
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
    ['lt', 'lte', 'gt', 'gte', 'eq', 'contains'].indexOf(keys[0]) !== -1 &&
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
