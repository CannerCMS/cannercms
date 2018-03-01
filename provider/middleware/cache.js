/**
 * @flow
 */

import type {Middleware} from './middleware';
import queryToString from '../utils/queryToString';
import {findAndReplaceField} from '../utils/replaceId';
import get from 'lodash/get';
import set from 'lodash/set';

export default class Cache implements Middleware {
  cachedData: {
    [key: string]: Array<{
      queryKey: string,
      response: $PropertyType<ContextType, 'response'>
    }>
  }

  constructor() {
    this.cachedData = {};
    (this: any).handleChange = this.handleChange.bind(this);
  }

  handleChange = (ctx: ContextType, next: NextType) => {
    const {request} = ctx;
    const {key} = request;
    switch (request.type) {
      case 'fetch': {
        const {query} = request;
        const queryKey = queryToString(query);
        const cachedData = this.getCachedDataByKey(key, queryKey);
        if (cachedData) {
          set(ctx, "response", cachedData);
          break;
        }
        return next().then(() => {
          this.cacheNewData({...ctx.response}, key, queryKey);
        });
      }
      case 'deploy': {
        return next().then(() => {
          const replace = get(ctx, "response.replace");
          const actions = get(ctx, "response.actions");
          const key = get(ctx, "request.key");
          if (replace) {
            this.replace(replace.slice());
          }
          if (!actions || actions.length === 0) {
            if (key) {
              delete this.cachedData[key];
            } else {
              this.cachedData = {};
            }
          }
        });
      }
      case 'reset': {
        return next();
      }
      default:
        break;
    }
  }

  replace(replace: $PropertyType<$PropertyType<ContextType, 'response'>, 'replace'>) {
    this.cachedData = (replace || []).reduce((acc, re) => {
      const paths = re.path.split('/');
      const key = paths[0];
      let allCached = acc[key];
      allCached = allCached.map(cached => {
        const {body} = cached.response;
        cached.response.body = findAndReplaceField(body, paths.slice(1), re.data);
        return cached;
      });
      acc[key] = allCached;
      return acc;
    }, this.cachedData);
  }

  cacheNewData(response: any, key: string, queryKey: string) {
    let updatedCachedData = this.cachedData;
    const cachedSize = (updatedCachedData[key] || []).length;
    if (cachedSize === 0) {
      this.cachedData[key] = [{
        queryKey,
        response
      }];
    } else if (cachedSize === 5) {
      // cache most five data
      this.cachedData[key].shift();
      this.cachedData[key].push({
        queryKey,
        response
      });
    } else {
      this.cachedData[key].push({
        queryKey,
        response
      });
    }
  }

  // eslint-disable-next-line max-len
  getCachedDataByKey(key: string, queryKey: string): ?$PropertyType<ContextType, 'response'> {
    // not existed return null
    if (!(key in this.cachedData)) {
      return null;
    }
    const cache = this.cachedData[key].find(cache => cache.queryKey === queryKey);
    return cache ? {...cache.response} : null;
  }
}
