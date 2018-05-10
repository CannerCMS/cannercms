import mutate from '../../src/action/mutate';
import {fromJS} from 'immutable';

const originValue = fromJS({
  info: {
    basicInfo: {
      name: 'name'
    }
  },
  posts: [{
    id: 'post1',
    title: 'post1',
    author: [{
      id: 'author1',
      name: 'author1'
    }]
  }]
})

describe('mutate', () => {
  test('update object', () => {
    const action = {
      type: 'UPDATE_OBJECT',
      payload: {
        key: 'info',
        value: fromJS({
          basicInfo: {
            name: 'name2'
          }
        })
      }
    };
    expect(mutate(originValue, action).getIn(['info', 'basicInfo', 'name'])).toEqual('name2');
  });

  test('update array', () => {
    const action = {
      type: 'UPDATE_ARRAY',
      payload: {
        key: 'posts',
        id: 'post1',
        value: fromJS({
          title: 'post2',
        })
      }
    };
    expect(mutate(originValue, action).getIn(['posts', 0]).toJS()).toMatchObject({
      id: 'post1',
      title: 'post2',
      author: [{
        name: 'author1',
        id: 'author1'
      }]
    });
  });

  test('create array', () => {
    const action = {
      type: 'CREATE_ARRAY',
      payload: {
        key: 'posts',
        value: fromJS({
          id: 'id2',
          title: 'post2',
          author: [{
            name: 'author1',
            id: 'author1'
          }]
        })
      }
    };
    expect(mutate(originValue, action).getIn(['posts', 1]).toJS()).toMatchObject({
      id: expect.anything(String),
      title: 'post2',
      author: [{
        name: 'author1',
        id: 'author1'
      }]
    });
  });

  test('delete array', () => {
    const action = {
      type: 'DELETE_ARRAY',
      payload: {
        key: 'posts',
        id: 'post1',
      }
    };
    expect(mutate(originValue, action).getIn(['posts']).size).toEqual(0);
  });

  test('connect', () => {
    const action = {
      type: 'CONNECT',
      payload: {
        key: 'posts',
        id: 'post1',
        path: 'author',
        value: fromJS({
          id: 'author2',
          name: 'author2'
        })
      }
    };
    expect(mutate(originValue, action).getIn(['posts', 0, 'author', 1]).toJS()).toMatchObject({
      id: 'author2',
      name: 'author2'
    });
  });

  test('create and connect', () => {
    const action = {
      type: 'CREATE_AND_CONNECT',
      payload: {
        key: 'posts',
        path: 'author',
        id: 'post1',
        value: fromJS({
          id: 'author2',
          name: 'author2'
        })
      }
    };
    expect(mutate(originValue, action).getIn(['posts', 0, 'author', 1]).toJS()).toMatchObject({
      id: 'author2',
      name: 'author2'
    });
  });

  test('disconnect', () => {
    const action = {
      type: 'DISCONNECT',
      payload: {
        key: 'posts',
        id: 'post1',
        path: 'author',
        value: fromJS({
          id: 'author1'
        })
      }
    };
    expect(mutate(originValue, action).getIn(['posts', 0, 'author']).size).toEqual(0);
  });

  test('disconnect and delete', () => {
    const action = {
      type: 'DISCONNECT_AND_DELETE',
      payload: {
        key: 'posts',
        id: 'post1',
        path: 'author',
        value: fromJS({
          id: 'author1'
        })
      }
    };
    expect(mutate(originValue, action).getIn(['posts', 0, 'author']).size).toEqual(0);
  })
})