// @flow

import * as React from 'react';
import {get} from 'lodash';
import DefaultToolbarLayout from './toolbarlayout';
import Pagination from './pagination';
import Sort from './sort';
import Filter from './filter/index';
import Actions from './actions';
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
  updateQuery: Function,
}

type Props = {
  children: React.Node,
  updateQuery: Function,
  parseConnectionToNormal: Function,
  getValue: Function,
  refId: RefId,
  keyName: string,
  defaultValue: Function,
  children: React.Element<*>,
  toolbar: {
    async: boolean,
    actions?: {
      component?: React.ComponentType<*>,
      exportButton?: boolean,
      importButton?: boolean,
      filterButton?: boolean,
    },
    sorter?: {
      component?: React.ComponentType<*>,
      [string]: *
    },
    pagination?: {
      component?: React.ComponentType<*>,
      [string]: *
    },
    filter?: {
      component?: React.ComponentType<*>,
      filters?: Array<Object>,
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
  originRootValue: Object,
  onChange?: Function
}

type State = {
  originRootValue: any,
  sort: any,
  filter: any,
  pagination: any,
  current: number,
  displayedFilterIndexs: Array<number>
}

export default class Toolbar extends React.PureComponent<Props, State> {
  async: boolean;

  constructor(props: Props) {
    super(props);
    const {args, originRootValue} = props;
    this.async = props.toolbar && props.toolbar.async;
    // $FlowFixMe
    const permanentFilter = (props.toolbar && props.toolbar.filter && props.toolbar.filter.permanentFilter) || {};
    this.state = {
      originRootValue,
      sort: parseOrder(args.orderBy),
      filter: {...parseWhere(args.where || {}), ...parseWhere(permanentFilter)},
      pagination: parsePagination(args),
      current: 1,
      displayedFilterIndexs: []
    };
  }

  static getDerivedStateFromProps(nextProps: Props) {
    const {originRootValue, args, toolbar} = nextProps;
    if (toolbar && !toolbar.async) {
      return {
        originRootValue
      };
    }
    // $FlowFixMe
    const permanentFilter = (toolbar.filter && toolbar.filter.permanentFilter) || {};
    return {
      originRootValue,
      sort: parseOrder(args.orderBy),
      filter: {...parseWhere(args.where || {}), ...parseWhere(permanentFilter)},
      pagination: parsePagination(args)
    };
  }

  changeOrder = ({orderField, orderType}: {orderField: string, orderType: string}) => {
    const {updateQuery, refId, args} = this.props;
    if (this.async) {
      if (orderField) {
        updateQuery(refId.getPathArr(), {first: 10, orderBy: `${orderField}_${orderType}`, where: args.where});
      } else {
        updateQuery(refId.getPathArr(), {first: 10, where: args.where});
      }
    } else {
      if (orderField) {
        this.setState({
          sort: {
            orderField,
            orderType
          }
        });
      } else {
        this.setState({
          sort: {}
        });
      }
      
    }
  }

  changeFilter = (where: Object) => {
    const {updateQuery, refId, args, toolbar} = this.props;
    let permanentFilter = {}
    if (toolbar && toolbar.filter && toolbar.filter.permanentFilter) {
      permanentFilter = toolbar.filter.permanentFilter || {};
    }
    if (this.async) {
      updateQuery(refId.getPathArr(), {
        first: 10,
        orderBy: args.orderBy,
        // $FlowFixMe
        where: {...processWhere(where), ...permanentFilter}
      });
    } else {
      this.setState({
        // $FlowFixMe
        filter: {...where}
      });
    }
  }

  changePage = (page: number) => {
    this.setState({
      current: page
    });
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

  addFilter = (index: number) => {
    this.setState({
      displayedFilterIndexs: this.state.displayedFilterIndexs.concat(index)
    });
  }

  deleteFilter = (index: number) => {
    this.setState({
      displayedFilterIndexs: this.state.displayedFilterIndexs.filter(i => i !== index)
    });
  }

  render() {
    const {children, toolbar = {}, args, refId, items, defaultValue, parseConnectionToNormal, getValue} = this.props;
    let {originRootValue, current, displayedFilterIndexs} = this.state;
    const {sorter, pagination, filter, toolbarLayout, actions} = toolbar;
    const ToolbarLayout = toolbarLayout && toolbarLayout.component ? toolbarLayout.component : DefaultToolbarLayout;
    const SortComponent = sorter && sorter.component ? sorter.component : Sort;
    const FilterComponent = filter && filter.component ? filter.component : Filter;
    const PaginationComponent = pagination && pagination.component ? pagination.component : Pagination;
    const ActionsComponent = actions && actions.component ? actions.component : Actions;
    const {orderField, orderType} = parseOrder(args.orderBy);
    const where = parseWhere(args.where || {});
    const {first, last} = parsePagination(args);
    let total = 0;
    if (!toolbar.async) {
      // TODO
      // originRootValue = filterByWhere(originRootValue, keyName, this.state.filter);
      // total = originRootValue[keyName].edges.length;
      // if (pagination) {
      //   originRootValue = paginate(originRootValue, keyName, current, 10);
      // }
    }
    const rootValue = parseConnectionToNormal(originRootValue);
    const value = getValue(originRootValue, refId.getPathArr());
    return <ToolbarLayout
      Actions={actions && toolbar.async ? <ActionsComponent
        {...actions}
        async={toolbar.async}
        filters={filter && filter.filters || []}
        displayedFilters={displayedFilterIndexs}
        addFilter={this.addFilter}
      /> : <div />}
      Sort={sorter && toolbar.async ? <SortComponent
        {...sorter}
        async={toolbar.async}
        defaultField={sorter.defaultField}
        options={sorter.options || []}
        changeOrder={this.changeOrder}
        orderField={orderField}
        orderType={orderType}
        items={items}
      /> : null}
      Pagination={pagination && toolbar.async ? <PaginationComponent
        {...pagination}
        async={toolbar.async}
        hasNextPage={get(value, ['pageInfo', 'hasNextPage'])}
        hasPreviousPage={get(value, ['pageInfo', 'hasPreviousPage'])}
        nextPage={this.nextPage}
        prevPage={this.prevPage}
        changeSize={this.changeSize}
        size={first || last}
        current={current}
        changePage={this.changePage}
        total={total}
      /> : null}
      Filter={filter && toolbar.async ? <FilterComponent
        async={toolbar.async}
        {...filter}
        displayedFilters={displayedFilterIndexs}
        items={items}
        where={where}
        changeFilter={this.changeFilter}
        deleteFilter={this.deleteFilter}
      /> : null}
    >
      {React.cloneElement(children, {
        rootValue,
        value: value ? get(value, 'edges', []).map(item => item.node) : defaultValue('array'),
        showPagination: toolbar && !toolbar.async
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
