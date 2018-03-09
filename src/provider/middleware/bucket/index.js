/**
 * @flow
 */

import createPattern from './pattern';
import {Map} from 'immutable';
import flatten from 'lodash/flatten';
import get from 'lodash/get';
import {passQuery} from '../../utils/query';
import queryToString from '../../utils/queryToString';
import type {Middleware} from '../middleware';
import {mutate} from '../../actions';
import {findAndReplaceField} from '../../utils/replaceId';

export default class Bucket implements Middleware {
  bucket: BucketType

  constructor() {
    this.bucket = {};
  }

  handleChange = (ctx: ContextType, next: NextType) => {
    const {request} = ctx;
    const {key} = request;
    switch (request.type) {
      case 'write': {
        let {action} = request;
        action = this.transformAction(action);
        this.addAction(action);
        break;
      }
      case 'fetch': {
        const {query} = request;
        return next().then(() => {
          ctx.response.body = this.mutateData(key, ctx.response.body, query, ctx.response.totalPage, ctx.response.mutate);
        });
      }
      case 'deploy': {
        const {key, id} = request;
        const actions = this._mergeActions(key, id);
        request.actions = actions;
        ctx.request = request;
        return next().then(() => {
          // should handle failed action
          this.clearQueue(key, id);
        }).catch(() => {
          //  if deploy failed, bucket will get the undeployed actions back
          this.clearQueue(key, id);
          get(ctx, 'response.actions', []).forEach((action) => {
            this.addAction(action);
          });
        });
      }

      case 'reset': {
        const {key, id} = request;
        this.clearQueue(key, id);
        return next();
      }
      default:
        return next();
    }
  }

  removeFirstAction(key: string) {
    this.bucket[key].actions.shift();
  }

  replace(replace: $PropertyType<$PropertyType<ContextType, 'response'>, 'replace'>) {
    (replace || []).forEach((re) => {
      const paths = re.path.split('/');
      const key = paths[0];
      this.bucket[key].actions = this.bucket[key].actions.map((action) => {
        const {value, id} = action.payload;
        if (id && id === re.data.from) {
          action.payload.id = re.data.to;
        }
        if (value) {
          action.payload.value = findAndReplaceField(value, paths.slice(1), re.data);
        }
        return action;
      });
    });
  }

  // To merge the actions,
  // transform mutateAction from 11 types to only four types:
  // CREATE_ARRAY_ITEM, UPDATE_ARRAY, DELETE_ARRAY_ITEM,
  // UPDATE_OBJECT
  transformAction(action: MutateAction): transformedAction {
    switch (action.type) {
      case 'UPDATE_ARRAY': // array
      case 'DELETE_ARRAY_NESTED_ITEM':
      case 'CREATE_ARRAY_NESTED_ITEM':
      case 'SWAP_ARRAY_NESTED_ITEM': {
        const {key, mutatedValue, path, id} = action.payload;
        const fieldName = typeof path === 'string' ?
          path.split('/')[0] :
          path[0].split('/')[0];
        const value = fieldName ?
          new Map().get(fieldName, mutatedValue && mutatedValue.get(fieldName)) :
          mutatedValue;
        return {
          type: 'UPDATE_OBJECT',
          payload: {
            key,
            id,
            path: '',
            value,
          },
        };
      }
       // object
      case 'DELETE_OBJECT_NESTED_ITEM':
      case 'CREATE_OBJECT_NESTED_ITEM':
      case 'SWAP_OBJECT_NESTED_ITEM':
      case 'UPDATE_OBJECT': {
        const {key, mutatedValue, path} = action.payload;
        const fieldName = typeof path === 'string' ?
          path.split('/')[0] :
          path[0].split('/')[0];
        const value = fieldName ?
          new Map().get(fieldName, mutatedValue && mutatedValue.get(fieldName)) :
          mutatedValue;
        return {
          type: 'UPDATE_OBJECT',
          payload: {
            key,
            path: '',
            value,
          },
        };
      }
      case 'DELETE_ARRAY_ITEM':
      case 'CREATE_ARRAY_ITEM':
        return action;
     
      default:
        return {
          type: 'NOOP',
        };
    }
  }

  addAction = (action: transformedAction) => {
    if (action.type === 'NOOP') {
      return;
    }
    const {payload} = action;
    // Noop 是沒有 name 的，直接忽略，因為 noop 不做事。
    const {key} = payload;
    if (key in this.bucket) {
      // 已存在相同 name 的 group
      // 加入該 group
      this.bucket[key].addAction(action);
      this.bucket[key].mergeAction();
    } else {
      // 建立新 group
      this.bucket[key] = createPattern(action);
    }
    this.bucketDidChange();
  }

  mutateData = (key: string, data: any, query: queryType, totalPage: ?number, cusMutate: Mutate) => {
    const {bucket} = this;
    const queryKey = queryToString(query);
    if (key in bucket) {
      return bucket[key].actions.reduce((acc, action) => {
        if (cusMutate) {
          return cusMutate(acc, action, mutate);
        }
        if (!passQuery(action, queryKey, totalPage || 1)) {
          return acc;
        }
        return mutate(acc, action);
      }, data);
    }
    return data;
  }

  clearQueue(key?: string, id?: string) {
    if (key && key in this.bucket && id) {
      this.bucket[key].actions = this.bucket[key].actions.filter((action) => {
        return action.payload.id !== id;
      });
    } else if (key && key in this.bucket) {
      delete this.bucket[key];
    } else {
      this.bucket = {};
    }
    this.bucketDidChange();
  }

  bucketDidChange() {
    if (process.env.NODE_ENV !== 'production') {
      // console.table(this.queue);
    }
  }

  _mergeActions(key: ?string, id: ?string) {
    if (key && key in this.bucket && id) {
      return this.bucket[key].actions.filter((action) => {
        return action.payload.id === id;
      });
    } else if (key && key in this.bucket) {
      return this.bucket[key].actions;
    }
    return flatten(Object.values(this.bucket)
      .map((pattern) => (pattern: any).actions));
  }
}
