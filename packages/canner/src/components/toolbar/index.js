// @flow
// TODO: remove the unused state
/* eslint react/no-unused-state: 0 */
import * as React from 'react';
import { get } from 'lodash';
import isObject from 'lodash/isObject';
import type RefId from 'canner-ref-id';
import DefaultToolbarLayout from './toolbarlayout';
import Pagination from './pagination';
import Sort from './sort';
import Filter from './filter/index';
import Actions from './actions';
import { getFieldValue } from '../../utils/value';
import { findAlwaysDisplayedFilterIndexes } from './utils';
import type { Query } from '../../query';

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
  refId: RefId,
  keyName: string,
  children: React.Element<*>,
  request: Function,
  deploy: Function,
  toolbar: {
    async: boolean,
    actions?: {
      component?: React.ComponentType<any>,
      export?: {
        fields?: Array<Object>,
        title?: string,
        filename?: string
      },
      import?: {},
      filter?: {}
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
  rootValue: Object,
  onChange?: Function
}

type State = {
  originRootValue: any,
  rootValue: any,
  sort: any,
  filter: any,
  pagination: any,
  current: number,
  displayedFilterIndexs: Array<number>
}

export default class Toolbar extends React.PureComponent<Props, State> {
  static defaultProps = {
    onChange: () => {}
  }
  // eslint-disable-next-line
  async: Boolean;

  constructor(props: Props) {
    super(props);
    const { args, originRootValue, rootValue } = props;
    this.async = (props.toolbar && (props.toolbar: any).async) || false;
    const permanentFilter = (props.toolbar && props.toolbar.filter && props.toolbar.filter.permanentFilter) || {};
    const displayedFilterIndexs = findAlwaysDisplayedFilterIndexes((props.toolbar && props.toolbar.filter && props.toolbar.filter.filters) || []);
    this.state = {
      originRootValue,
      rootValue,
      sort: parseOrder(args.orderBy),
      filter: { ...parseWhere(args.where || {}), ...parseWhere(permanentFilter) },
      pagination: parsePagination(args),
      current: 1,
      displayedFilterIndexs,
    };
  }

  static getDerivedStateFromProps(nextProps: Props) {
    const {
      originRootValue, rootValue, args, toolbar,
    } = nextProps;
    if (toolbar && !toolbar.async) {
      return {
        originRootValue,
        rootValue,
      };
    }
    const permanentFilter = (toolbar.filter && toolbar.filter.permanentFilter) || {};
    return {
      originRootValue,
      rootValue,
      sort: parseOrder(args.orderBy),
      filter: { ...parseWhere(args.where || {}), ...parseWhere(permanentFilter) },
      pagination: parsePagination(args),
    };
  }

  changeOrder = ({ orderField, orderType }: {orderField: string, orderType: string}) => {
    const { updateQuery, refId, args } = this.props;
    if (this.async) {
      if (orderField) {
        updateQuery(refId.getPathArr(), { first: 10, orderBy: `${orderField}_${orderType}`, where: args.where });
      } else {
        updateQuery(refId.getPathArr(), { first: 10, where: args.where });
      }
    } else if (orderField) {
      this.setState({
        sort: {
          orderField,
          orderType,
        },
      });
    } else {
      this.setState({
        sort: {},
      });
    }
  }

  changeFilter = (where: Object) => {
    const {
      updateQuery, refId, args, toolbar,
    } = this.props;
    let permanentFilter = {};
    if (toolbar && toolbar.filter && toolbar.filter.permanentFilter) {
      permanentFilter = toolbar.filter.permanentFilter || {};
    }
    if (this.async) {
      updateQuery(refId.getPathArr(), {
        first: 10,
        orderBy: args.orderBy,
        where: { ...processWhere(where), ...permanentFilter },
      });
    } else {
      this.setState({
        filter: { ...where },
      });
    }
  }

  changePage = (page: number) => {
    this.setState({
      current: page,
    });
  }

  nextPage = () => {
    const {
      updateQuery, args, refId, keyName,
    } = this.props;
    const { originRootValue, pagination } = this.state;
    if (get(originRootValue, [keyName, 'pageInfo', 'hasNextPage'])) {
      const after = originRootValue[keyName].edges.slice(-1)[0].cursor; // the last one
      updateQuery(refId.getPathArr(), {
        ...args,
        first: pagination.first || 10,
        after,
        last: undefined,
        before: undefined,
      });
    }
  }

  prevPage = () => {
    const {
      updateQuery, args, refId, keyName,
    } = this.props;
    const { originRootValue, pagination } = this.state;
    if (get(originRootValue, [keyName, 'pageInfo', 'hasPreviousPage'])) {
      const before = get(originRootValue, [keyName, 'edges', 0, 'cursor']); // the first one
      updateQuery(refId.getPathArr(), {
        ...args,
        last: pagination.last || 10,
        before,
        after: undefined,
        first: undefined,
      });
    }
  }

  changeSize = (size: number) => {
    const { updateQuery, args, refId } = this.props;
    const pagination = parsePagination(args);
    if (pagination.last) {
      updateQuery(refId.getPathArr(), {
        ...args,
        last: size,
      });
    } else {
      updateQuery(refId.getPathArr(), {
        ...args,
        first: size,
      });
    }
  }

  addFilter = (index: number) => {
    this.setState(preState => ({
      displayedFilterIndexs: preState.displayedFilterIndexs.concat(index),
    }));
  }

  deleteFilter = (index: number) => {
    this.setState(preState => ({
      displayedFilterIndexs: preState.displayedFilterIndexs.filter(i => i !== index),
    }));
  }

  render() {
    const {
      children,
      toolbar = {},
      args,
      refId,
      items,
      query,
      keyName,
      request,
      deploy,
    } = this.props;
    const {
      originRootValue, rootValue, current, displayedFilterIndexs,
    } = this.state;
    const {
      sorter, pagination, filter, toolbarLayout, actions,
    } = toolbar;
    const ToolbarLayout = toolbarLayout && toolbarLayout.component ? toolbarLayout.component : DefaultToolbarLayout;
    const SortComponent = sorter && sorter.component ? sorter.component : Sort;
    const FilterComponent = filter && filter.component ? filter.component : Filter;
    const PaginationComponent = pagination && pagination.component ? pagination.component : Pagination;
    const ActionsComponent = actions && actions.component ? actions.component : Actions;
    const { orderField, orderType } = parseOrder(args.orderBy);
    const where = parseWhere(args.where || {});
    const { first, last } = parsePagination(args);
    const total = 0;
    const value = getFieldValue(originRootValue, refId.getPathArr());
    return (
      <ToolbarLayout
        Actions={actions && toolbar.async ? (
          <ActionsComponent
            {...actions}
            async={toolbar.async}
            filters={(filter && filter.filters) || []}
            displayedFilters={displayedFilterIndexs}
            addFilter={this.addFilter}
            query={query}
            keyName={keyName}
            value={rootValue[keyName]}
            items={items.items}
            request={request}
            deploy={deploy}
          />
        ) : <div />}
        Sort={sorter && toolbar.async ? (
          <SortComponent
            {...sorter}
            async={toolbar.async}
            defaultField={sorter.defaultField}
            options={sorter.options || []}
            changeOrder={this.changeOrder}
            orderField={orderField}
            orderType={orderType}
            items={items}
          />
        ) : null}
        Pagination={pagination && toolbar.async ? (
          <PaginationComponent
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
          />
        ) : null}
        Filter={filter && toolbar.async ? (
          <FilterComponent
            async={toolbar.async}
            {...filter}
            displayedFilters={displayedFilterIndexs}
            items={items}
            where={where}
            changeFilter={this.changeFilter}
            deleteFilter={this.deleteFilter}
          />
        ) : null}
      >
        {children && React.cloneElement(children, {
          rootValue,
          value: value ? get(value, 'edges', []).map(item => item.node) : [],
          showPagination: toolbar && !toolbar.async,
        })}
      </ToolbarLayout>
    );
  }
}

export function parseOrder(orderBy: ?string): {orderField: string | null, orderType: 'ASC' | 'DESC'} {
  if (typeof orderBy === 'string') {
    const [orderField, orderType] = orderBy.split('_');
    if (orderType !== 'ASC' && orderType !== 'DESC') {
      return { orderField, orderType: 'ASC' };
    }
    return { orderField, orderType };
  }
  return {
    orderField: null,
    orderType: 'ASC',
  };
}

export function parsePagination(args: Object = {}) {
  return {
    first: args.first,
    after: args.after,
    last: args.last,
    before: args.before,
  };
}

export function parseWhere(where: Object) {
  return Object.keys(where).reduce((result: Object, key: string) => {
    const rtn = result;
    const v = where[key];
    const type = typeof v;
    const [field, op] = key.split('_');
    if (type === 'string') {
      rtn[field] = { [op || 'eq']: v };
    }

    if (type === 'boolean') {
      rtn[field] = { [op || 'eq']: v };
    }

    if (type === 'number') {
      rtn[field] = { [op || 'eq']: v };
    }

    if (type === 'object') {
      rtn[field] = parseWhere(v);
    }
    return rtn;
  }, {});
}

export function processWhere(where: Object) {
  return Object.keys(where).reduce((result: Object, key: string) => {
    const rtn = result;
    const v = where[key];
    if (isEnd(v)) {
      const { op, value } = parseOpAndValue(v);
      rtn[`${key}_${op}`] = value;
    } else {
      rtn[key] = processWhere(v);
    }

    return rtn;
  }, {});
}

function isEnd(v: Object) {
  if (!isObject(v)) {
    return false;
  }

  const keys = Object.keys(v);
  const value = v[keys[0]];
  return keys.length === 1
    && ['lt', 'lte', 'gt', 'gte', 'eq', 'contains'].indexOf(keys[0]) !== -1
    && (typeof value === 'string'
    || typeof value === 'boolean'
    || typeof value === 'number');
}

function parseOpAndValue(v: Object) {
  const op = Object.keys(v)[0];
  const value = v[op];
  return {
    op,
    value,
  };
}
