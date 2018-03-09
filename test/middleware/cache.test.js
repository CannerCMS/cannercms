import {Cache} from '../../src/middleware';
import {fromJS} from 'immutable';
import queryToString from '../../src/utils/queryToString';

/* eslint-disable camelcase */
const ID1= '1';
const ID2 = '2';
const ID3 = '3';
const ID4 = '4';
const query1 = {
  filter: {
    title: {$eq: 'hello'},
  },
};
const query2 = {
  filter: {
    view: {$gt: 50},
    title: {$eq: 'hello'},
  },
};

const originResponse = {
  pagintation: {
    start: 'id1',
    limit: 10,
  },
  body: fromJS([{title: 'hello', description: 'origin', _id: ID1}]),
};
const nextResponse = {
  pagintation: {
    start: 'id1',
    limit: 10,
  },
  body: fromJS([{title: 'hello', description: 'next', _id: ID1}]),
};

function createCache(res) {
  const cache = new Cache();
  cache.cachedData = {
    posts: [{
      queryKey: queryToString(query1),
      response: res,
    }],
  };
  return cache;
}

describe('Cache', () => {
  it('getDataByKey should be work', async () => {
    const cache = createCache(originResponse);
    // no cache
    let data = cache.getCachedDataByKey('posts', queryToString(query1));
    expect(data).toEqual(originResponse);
    // cache
    data = cache.getCachedDataByKey('posts', queryToString(query2));
    expect(data).toEqual(null);
  });

  it('cacheNewData', () => {
    const cache = createCache(originResponse);
    cache.cacheNewData(nextResponse, 'people', queryToString());
    expect(cache.cachedData.people[0].queryKey).toBe('all');
    expect(cache.cachedData.people[0].response).toEqual(nextResponse);
  });
});

describe('replace id in cache', () => {
  it('replace', () => {
    const replace = [
      {
        path: 'posts/_id',
        data: {
          from: ID1,
          to: ID2,
        },
      },
      {
        path: 'category/_id',
        data: {
          from: ID3,
          to: ID4,
        },
      },
      {
        path: 'posts/category',
        data: {
          from: ID3,
          to: ID4,
        },
      },
      {
        path: 'info/category',
        data: {
          from: ID3,
          to: ID4,
        },
      },
    ];
    const cache = createCache({
      body: fromJS([
        {_id: ID1, name: 'posts1', category: [ID3]},
      ]),
    });
    cache.cacheNewData({
      body: fromJS([
        {_id: ID3, name: 'category1'},
      ]),
    }, 'category', queryToString());
    cache.cacheNewData({
      body: fromJS({
        category: [ID3],
      }),
    }, 'info', queryToString());
    cache.replace(replace);
    const newPost = [
      {_id: ID2, name: 'posts1', category: [ID4]},
    ];
    const newCategory = [
      {_id: ID4, name: 'category1'},
    ];
    const newInfo = {
      category: [ID4],
    };
    expect(cache.cachedData.posts[0].response.body.toJS()).toEqual(newPost);
    expect(cache.cachedData.category[0].response.body.toJS()).toEqual(newCategory);
    expect(cache.cachedData.info[0].response.body.toJS()).toEqual(newInfo);
  });
});

