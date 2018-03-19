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
    const type = context.request.type;
    const style = consoleStyle(type);
    if (process.env.NODE_ENV === 'development' && type !== 'subscribe') {
      requestId = Math.random().toString(36).substr(-3);
      // eslint-disable-next-line
      console.log(`%c -----------request-${requestId}-start------------`, style);
    }
    return this.fn(context).then(() => {
      if (process.env.NODE_ENV === 'development' && type !== 'subscribe') {
        // eslint-disable-next-line
        console.log(`%c type: ${type}, key: ${context.request.key},`, style, 'contenxt:', context);
        // eslint-disable-next-line
        console.log(`%c -----------request-${requestId}-finished------------`, style);
      }
      return context;
    }).catch((e) => {
      // eslint-disable-next-line
      console.log(e);
      // eslint-disable-next-line
      console.log(context);
      if (process.env.NODE_ENV === 'development' && type !== 'subscribe') {
        // eslint-disable-next-line
        console.log(`-----------request-${requestId}-failed------------`);
      }
      throw new Error(e);
    });
  }
}

function consoleStyle(type) {
  switch (type) {
    case 'write':
      return 'color: red;';
    case 'deploy':
      return 'color: blue;';
    case 'fetch':
      return 'color: orange;';
    default:
      return '';
  }
}

