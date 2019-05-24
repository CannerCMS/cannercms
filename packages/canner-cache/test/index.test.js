import Cache from '../src';

describe('cache', () => {
  const key = 'POSTS';
  const data = {
    edges: [{
      cursor: '1',
      node: {
        id: '1',
        title: 'title1',
      },
    }, {
      cursor: '2',
      node: {
        id: '2',
        title: 'title2',
      },
    }],
  };
  let cache;
  beforeEach(() => {
    const reducer = (data, action) => {
      switch (action.type) {
        case 'ADD_POST':
          return {
            edges: data.edges.concat(action.payload),
          };
        default:
          return data;
      }
    };
    cache = new Cache({ reducer });
  });

  it('should set data', () => {
    cache.setData(key, data);
    expect(cache.data[key]).toEqual(data);
  });

  it('should get data', () => {
    cache.setData(key, data);
    const d = cache.getData(key);
    expect(d).toEqual(data);
  });

  it('should throw error if the key does not exist', () => {
    expect(() => cache.getData(key)).toThrow(/There is no/);
  });

  it('should mutate', () => {
    cache.setData(key, data);
    const newPost = {
      cursor: '3',
      node: {
        id: '3',
        title: 'new one',
      },
    };
    const action = {
      type: 'ADD_POST',
      payload: newPost,
    };
    cache.setData(key, data);
    cache.mutate(key, action);
    expect(cache.data[key].edges[2]).toEqual(newPost);
  });

  it('can be subscribed', () => {
    const callback = jest.fn();
    const newData = { edges: [] };
    const newPost = {
      cursor: '3',
      node: {
        id: '3',
        title: 'new one',
      },
    };
    const action = {
      type: 'ADD_POST',
      payload: newPost,
    };
    cache.setData(key, data);
    cache.subscribe(key, callback);
    cache.setData(key, newData);
    cache.mutate(key, action);
    expect(callback.mock.calls.length).toEqual(2);
    expect(callback.mock.calls[0][0]).toEqual(newData);
    expect(callback.mock.calls[1][0]).toEqual({ edges: [newPost] });
  });
});
