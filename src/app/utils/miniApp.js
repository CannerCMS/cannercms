// @flow
// miniApp is a proxy to cache data
// used in popup

import App from '../app';
import {CacheStore, Bucket, MiniEndpointMiddleware} from '../middleware';

export default class MiniApp {
  app: App;
  constructor({request, fetch, subscribe}: {request: Function, fetch: Function, subscribe: Function}) {
    this.app = new App()
      .use(new CacheStore())
      .use(new Bucket())
      .use(new MiniEndpointMiddleware({request, fetch, subscribe}));
  }

  fetch = (key: string, componentId: string, query: queryType, mutate: Mutate): Promise.resolve<*> => {
    return this.app.handleChange({
      request: {
        type: 'fetch',
        key,
        query,
        componentId,
      },
      response: {
        mutate,
      },
    });
  }

  subscribe = (key: string, componentId: string, subjectType: SubjectType, observer: rxjs$Observer<*>): Promise.resolve<*> => {
    return this.app.handleChange({
      request: {
        type: 'subscribe',
        key,
        observer,
        componentId,
        subjectType,
      },
    }).then((ctx) => ctx.response.subscription);
  }

  request = (action: MutateAction) => {
    if (action.type !== 'NOOP') {
      const {key} = action.payload;
      return this.app.handleChange({
        request: {
          type: 'write',
          action,
          key,
        },
      });
    }
  }

  deploy = (key?: string, id?: string) => {
    return this.app.handleChange({
      request: {
        type: 'deploy',
        key,
        id,
      },
    });
  }

  reset = (key?: string, id?: string, query?: {[string]: any}) => {
    return this.app.handleChange({
      request: {
        type: 'reset',
        key,
        id,
        query,
        componentId: key,
      },
    });
  }
}
