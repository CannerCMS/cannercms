/**
 * @flow
 */
import type {Middlware} from './middleware';
export default class App {
  middleware: Array<Middlware.handleChange>
  handleChange: any => any

  constructor() {
    this.handleChange = this.handleChange.bind(this);
    this.middleware = [];
  }

  use(middlware: Middlware) {
    this.middleware.push(middlware.handleChange);
    return this;
  }

  fn(context: ContextType): Promise<any> {
    // last called middleware
    let index = -1;
    const {middleware} = this;
    return dispatch(0);

    // eslint-disable-next-line require-jsdoc
    function dispatch(i) {
      if (i <= index) {
        return Promise.reject(new Error('next() called multiple times'));
      }
      index = i;
      let fn = middleware[i];
      if (!fn) {
        return Promise.resolve();
      }
      try {
        return Promise.resolve(fn(context, () => {
          return dispatch(i + 1);
        }));
      } catch (err) {
        return Promise.reject(err);
      }
    }
  }

  handleChange(context: ContextType): Promise<any> {
    let requestId = '';
    if (process.env.NODE_ENV === 'development' && context.request.type !== 'subscribe') {
      requestId = Math.random().toString(36).substr(-3);
      console.log(`-----------request-${requestId}-start------------`);
      console.time(`request-${requestId}`);
    }
    return this.fn(context).then(() => {
      if (process.env.NODE_ENV === 'development' && context.request.type !== 'subscribe') {
        console.timeEnd(`request-${requestId}`);
        console.log(`type: ${context.request.type}, key: ${context.request.key},`, 'contenxt:', context);
        console.log(`-----------request-${requestId}-finished------------`);
      }
      return context;
    }).catch((e) => {
      console.log(e);
      console.log(context);
      if (process.env.NODE_ENV === 'development' && context.request.type !== 'subscribe') {
        console.timeEnd(`request-${requestId}`);
        console.log(`-----------request-${requestId}-failed------------`);
      }
      throw new Error(e);
    });
  }
}
