import EndpointMiddleware from '../../src/middleware/endpointMiddleware';

class Endpoint {
  getArray(key, query) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([{test: 123}]);
      });
    });
  }
}

const endpoint = new Endpoint();
const middleware = new EndpointMiddleware({
  endpoint: {
    posts: endpoint
  },
  schema: {
    posts: {
      type: 'array'
    }
  }
});

describe('test fetch', () => {
  it('should call fetchdata only one time', () => {
    const fn = jest.fn();
    middleware._fetchData = key => {
      return new Promise(resolve => {
        setTimeout(() => {
          fn();
          if (key === 'posts') {
            resolve(1);
          } else {
            resolve(2);
          }
        }, 1000);
      });
    };
    return Promise.all([
      middleware.waitFetch('info', {}).then(value => {
        expect(value).toBe(2);
      }),
      middleware.waitFetch('posts', {}).then(value => {
        expect(value).toBe(1);
      }),
      middleware.waitFetch('info', {}),
      middleware.waitFetch('posts', {})
    ])
      .then(() => {
        expect(fn).toHaveBeenCalledTimes(2);
      });
  });
});

