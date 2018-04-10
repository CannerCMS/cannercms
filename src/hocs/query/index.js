// @flow

import * as React from 'react';
import Sort from './sort';
import Pagination from './pagination';
import Filter from './filter';
import isString from 'lodash/isString';
import isUndefined from 'lodash/isUndefined';
import type RefId from 'canner-ref-id';

type Props = {
  filter: filterType,
  sort: sortType,
  params: Object,
  routes: Array<string>,
  componentId: string,
  fetch: FetchDef,
  refId: RefId
}

type State = {
  filter: filterType,
  sort: sortType,
  pagination: {
    start: number,
    limit: number,
  },
  paginationRes: any,
  value: any,
}

export default (Plugin: React.ComponentType<*>) => {
  return class PluginWithQuery extends React.PureComponent<Props, State> {
    constructor(props: Props) {
      super(props);
      this.state = {
        filter: {},
        sort: {},
        pagination: {
          start: 0,
          limit: 10,
        },
        paginationRes: {},
        value: null,
      };
      this.changeFilter = this.changeFilter.bind(this);
      this.changeSort = this.changeSort.bind(this);
      this.changePagination = this.changePagination.bind(this);
    }

    componentWillMount() {
      const {refId, subscribe, componentId} = this.props;
      this.queryData()
        .then(() => {
          subscribe(refId.toString(), componentId, 'value', (value) => {
            this.setState({
              value,
            });
          });
        });
    }

    queryData() {
      const {refId, fetch, componentId} = this.props;
      const {filter, sort, pagination} = this.state;
      return fetch(refId.toString(), componentId, {filter, sort, pagination}).then((ctx) => {
        this.setState({
          paginationRes: ctx.response.pagination,
          value: ctx.response.body,
        });
      });
    }

    changeFilter(condition) {
      this.setState({
        filter: condition,
      }, this.queryData);
    }

    changeSort(condition) {
      this.setState({
        sort: condition,
      }, this.queryData);
    }

    changePagination(start, limit) {
      this.setState({
        pagination: {
          start,
          limit,
        },
      }, this.queryData);
    }

    render() {
      const {filter, sort, params, routes} = this.props;
      const {paginationRes, pagination, value} = this.state;
      const op = params && params.op;
      if (!value) {
        return null;
      }
      return (
        <div>
          {
            // 如果是 string 則不是交給這個 filter 處理
            // 是 restful-qa 會在 render 前 filter
            // 目前只有 ireconcile 使用到
            op === 'create' || routes.length > 1 || isString(filter) || isUndefined(filter) ?
              null :
              <Filter onChange={this.changeFilter} schema={filter}/>
          }
          {
            op === 'create' || routes.length > 1 || isUndefined(sort) ?
              null :
              <Sort onChange={this.changeSort} options={sort}/>
          }
          <Plugin {...this.props} query={{filter: this.state.filter, sort: this.state.sort, pagination}} rootValue={value} value={value} showPagination={false}/>
          {
            op === 'create' || routes.length > 1 ?
              null :
              <Pagination onChange={this.changePagination} pagination={pagination} paginationRes={paginationRes}/>
          }
        </div>
      );
    }
  };
};

