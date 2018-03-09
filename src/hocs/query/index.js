import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Sort from './sort';
import Pagination from './pagination';
import Filter from './filter';
import isString from 'lodash/isString';
import isUndefined from 'lodash/isUndefined';

export default (Plugin) => {
  // 因為 decorator 會造成 context 沒辦法正確的傳下去
  // 必須在這裡給予 contextTypes 才行。
  // https://github.com/Canner/react-qa-core-plugins/issues/43
  return class PluginWithQuery extends PureComponent {
    static contextTypes = {
      fetch: PropTypes.func,
      subscribe: PropTypes.func,
    };

    static childContextTypes = {
      rootValue: PropTypes.any,
    }

    getChildContext() {
      return {
        rootValue: this.state.value,
      };
    }

    constructor(props) {
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
      this.componentId = props.id;
    }

    componentWillMount() {
      const {subscribe} = this.context;
      const {id} = this.props;
      this.queryData()
        .then(() => {
          subscribe(id, this.componentId, 'value', (value) => {
            this.setState({
              value,
            });
          });
        });
    }

    queryData() {
      const {fetch} = this.context;
      const {id} = this.props;
      const {filter, sort, pagination} = this.state;
      return fetch(id, this.componentId, {filter, sort, pagination}).then((ctx) => {
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

