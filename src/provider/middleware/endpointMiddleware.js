/**
 * @flow
 */
import type Endpoint from '../endpoint';
import type {Middleware} from './middleware';
import {fromJS} from 'immutable';
import Promise from 'promise-polyfill';
import set from 'lodash/set';
import get from 'lodash/get';
import queryToString from '../utils/queryToString';
import has from 'lodash/has';
import unset from 'lodash/unset';

export default class EndpointMiddleware implements Middleware {
  endpoint: {[string]: Endpoint};
  schema: {[string]: any};
  fetchMap: {[key: string]: {
    [queryString: string]: Promise<any>
  }};

  constructor({endpoint, schema}: {endpoint: Endpoint, schema: {[string]: any}}) {
    this.endpoint = endpoint;
    this.schema = schema;
    this.fetchMap = {};
  }

  handleChange = (ctx: ContextType, next: NextType) => {
    const {request} = ctx;
    const {key} = request;
    switch (request.type) {
      case 'fetch': {
        const {query} = request;
        return this.waitFetch(key, query)
          .then((data) => {
            if (data && 'totalPage' in data) {
              set(ctx, 'response.pagination', {
                totalPage: data.totalPage,
                page: data.page,
                goTo: genGoTo((query || {}).pagination || {}),
              });
              set(ctx, 'response.body', fromJS(data.data));
              return data;
            }
            set(ctx, 'response.body', fromJS(data));
            return data;
          });
      }
      case 'deploy': {
        const {actions = []} = request;
        // make the promises execute serially
        return actions.reduce((prePromise: Promise.resolve<*>, action, index: number) => {
          return prePromise.then(() => this._deploy(action, ctx))
            .catch((e) => {
              ctx.response.actions = actions.slice(index);
              throw new Error(e);
            });
        }, Promise.resolve());
      }
      default:
        return next();
    }
  }

  waitFetch = (key: string, query: queryType) => {
    const queryKey = queryToString(query);
    if (!has(this, `fetchMap.${key}.${queryKey}`)) {
      set(this, `fetchMap.${key}.${queryKey}`, this._fetchData(key, query));
    }
    return get(this, `fetchMap.${key}.${queryKey}`)
      .then((ctx) => {
        unset(this, `fetchMap.${key}.${queryKey}`);
        return ctx;
      });
  }

  _fetchData = (key: string, query: ?queryType) => {
    if (this.schema[key].type === 'array') {
      return this.endpoint[key].getArray(key, query);
    }
    return this.endpoint[key].getObject(key);
  }

  _deploy(action: transformedAction, ctx: ContextType): Promise.resolve<*> {
    switch (action.type) {
      case 'CREATE_ARRAY_ITEM': {
        let {value, key} = action.payload;
        value = value.toJS ? value.toJS() : value;
        return this.endpoint[key].createArray(key, value)
          .then((replace) => {
            if (!get(ctx, 'response.replace')) {
              set(ctx, 'response.replace', []);
            }
            if (replace && replace.length) {
              // $FlowFixMe
              ctx.response.replace = ctx.response.replace.concat(replace);
            }
          });
      }
      case 'UPDATE_ARRAY': {
        let {value, id, key} = action.payload;
        value = value.toJS ? value.toJS() : value;
        return this.endpoint[key].updateArray(key, id, value);
      }
      case 'UPDATE_OBJECT': {
        let {value, key} = action.payload;
        value = value.toJS ? value.toJS() : value;
        return this.endpoint[key].updateObject(key, value);
      }
      case 'DELETE_ARRAY_ITEM': {
        const {id, key} = action.payload;
        return this.endpoint[key].deleteArray(key, id);
      }
      // swap array item do nothing
      default:
        return Promise.resolve();
    }
  }
}

function genGoTo({limit}: {limit: number}) {
  limit = limit || 10;
  const perPage = limit;
  return function test(page) {
    return {
      start: (page - 1) * perPage,
      limit: perPage,
    };
  };
}
