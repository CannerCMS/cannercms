import LocalStorageQuery,
  {LOCAL_STORAGE_NAME} from '../../src/endpoint/localstorage';
import store from 'store';
import simple from '../data/simple';
import {UNIQUE_ID} from '../../src/config';
const {schema} = simple;

beforeAll(() => {
  store.clearAll();
});
const localStorageQuery = new LocalStorageQuery({schema});
describe('LocalStorageQuery common method', () => {
  it('prepare can work', () => {
    return localStorageQuery.prepare();
  });

  it('generateUniqueId', () => {
    expect(localStorageQuery.generateUniqueId()).toBeDefined();
    expect(localStorageQuery.generateUniqueId()).not.toBe(localStorageQuery.generateUniqueId());
  });
});

describe('LocalStorageQuery array', () => {
  it('getArray if empty', () => {
    return localStorageQuery.getArray('posts')
    .then(resp => {
      expect(resp.length).toEqual(0);
    });
  });

  const firstId = localStorageQuery.generateUniqueId();
  it('createArray', () => {
    return localStorageQuery.createArray('posts', {
      [UNIQUE_ID]: firstId,
      title: 'aaa',
      body: 'aaa'
    })
    .then(resp => {
      expect(resp.length).toEqual(1);
    });
  });
  const secondId = localStorageQuery.generateUniqueId();

  it('updateArray', () => {
    return localStorageQuery.createArray('posts', {
      [UNIQUE_ID]: secondId,
      title: 'bbb',
      body: 'bbb'
    }).then(() => {
      return localStorageQuery.updateArray('posts', secondId, {
        title: 'ccc',
        body: 'ccc'
      });
    })
    .then(resp => {
      expect(resp[1].title).toEqual('ccc');
    });
  });

  it('getArray Query filter eq', () => {
    return localStorageQuery.getArray('posts', {filter: {title: {$eq: 'aaa'}}})
      .then(resp => {
        expect(resp.length).toEqual(1);
      });
  });

  it('getArray Query normal pg', () => {
    return localStorageQuery.getArray('posts', {pagination: {page: 1, perPage: 10}})
      .then(resp => {
        expect(resp.totalPage).toEqual(1);
        expect(resp.data.length).toEqual(2);
      });
  });

  it('getArray Query normal2 pg', () => {
    return localStorageQuery.getArray('posts', {pagination: {page: 1, perPage: 1}})
      .then(resp => {
        expect(resp.totalPage).toEqual(2);
        expect(resp.data.length).toEqual(1);
      });
  });

  it('getArray Query pg only page', () => {
    return localStorageQuery.getArray('posts', {pagination: {page: 1}})
      .then(resp => {
        expect(resp.totalPage).toEqual(1);
        expect(resp.data.length).toEqual(2);
      });
  });

  it('getArray Query pg only perPage', () => {
    return localStorageQuery.getArray('posts', {pagination: {perPage: 10}})
      .then(resp => {
        expect(resp.totalPage).toEqual(1);
        expect(resp.data.length).toEqual(2);
      });
  });

  it('getArray Query sort', () => {
    return localStorageQuery.getArray('posts', {sort: {title: 1}})
      .then(resp => {
        expect(resp[0].title).toEqual('aaa');
      });
  });

  it('getArray Query reverse sort', () => {
    return localStorageQuery.getArray('posts', {sort: {title: -1}})
      .then(resp => {
        expect(resp[0].title).toEqual('ccc');
      });
  });

  it('deleteArray', () => {
    return localStorageQuery.deleteArray('posts', secondId)
    .then(resp => {
      const local = store.get(LOCAL_STORAGE_NAME);
      expect(local.posts.length).toEqual(1);
      expect(resp[0][UNIQUE_ID]).toEqual(firstId);
    });
  });
});

describe('LocalStorage Query object', () => {
  it('getObject', () => {
    return localStorageQuery.getObject('article')
    .then(resp => {
      expect(Object.keys(resp)).toEqual(Object.keys(schema.article.items));
    });
  });

  it('updateObject', () => {
    return localStorageQuery.updateObject('article', {
      title: 'hihi',
      body: 'yoyo'
    })
    .then(resp => {
      expect(resp.article).toEqual({
        title: 'hihi',
        body: 'yoyo'
      });
    });
  });
});

afterAll(() => {
  store.clearAll();
});
