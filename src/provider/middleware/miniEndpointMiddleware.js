/**
 * @flow
 */

import type {Middleware} from './middleware';
import Promise from 'promise-polyfill';

export default class MiniEndpointMiddleware implements Middleware {
  request: Function;
  fetch: Function;

  constructor({request, fetch, subscribe}: {request: Function, fetch: Function, subscribe: Function}) {
    (this: any).request = request;
    (this: any).fetch = fetch;
    (this: any).subscribe = subscribe;
  }

  handleChange = (ctx: ContextType, next: NextType) => {
    const {request} = ctx;
    const {key} = request;
    switch (request.type) {
      case 'fetch': {
        const {query, componentId} = request;
        return this.fetch(key, componentId, query, ctx.response.mutate)
          .then((upCtx) => {
            ctx.response = {...upCtx.response};
            ctx.request = {...upCtx.request};
          });
      }

      case 'deploy': {
        const {actions = []} = request;
        // make the promises execute serially
        return actions.reduce((prePromise: Promise.resolve<*>, action) => {
          return prePromise.then(() => this.request(action));
        }, Promise.resolve());
      }

      case 'subscribe': {
        const {componentId, subjectType, observer} = request;
        return this.subscribe(key, componentId, subjectType, observer);
      }

      case 'reset': {
        const {query, componentId} = request;
        return this.fetch(key, componentId, query || {})
          .then((upCtx) => {
            ctx.response = {...upCtx.response};
            ctx.request = {...upCtx.request};
          });
      }

      default:
        return next();
    }
  }
}
