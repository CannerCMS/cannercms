import mutate from '../../src/action/mutate';

let originValue = {
  info: {
    basicInfo: {
      name: 'name'
    }
  },
  posts: {
    edges: [{
      cursor: 'post1',
      node: {
        id: 'post1',
        title: 'post1',
        author: [{
          id: 'author1',
          name: 'author1'
        }]
      }
    }]
  }
}

describe('mutate', () => {
  test('update object', () => {
    const action = {
      type: 'UPDATE_OBJECT',
      payload: {
        key: 'info',
        value: {
          basicInfo: {
            name: 'name2'
          }
        }
      }
    };
    expect(mutate(originValue, action).info.basicInfo.name).toEqual('name2');
  });

  test('update array', () => {
    const action = {
      type: 'UPDATE_ARRAY',
      payload: {
        key: 'posts',
        id: 'post1',
        value: {
          title: 'post2',
        }
      }
    };
    expect(mutate(originValue, action).posts.edges[0].node).toMatchObject({
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
        value: {
          id: 'id2',
          title: 'post2',
          author: [{
            name: 'author1',
            id: 'author1'
          }]
        }
      }
    };
    expect(mutate(originValue, action).posts.edges[1].node).toMatchObject({
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
    expect(mutate(originValue, action).posts.edges.length).toEqual(0);
  });

  test('connect', () => {
    const action = {
      type: 'CONNECT',
      payload: {
        key: 'posts',
        id: 'post1',
        path: 'author',
        value: {
          id: 'author2',
          name: 'author2'
        },
        relation: {
          type: 'toMany'
        }
      }
    };
    expect(mutate(originValue, action).posts.edges[0].node.author[1]).toMatchObject({
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
        value: {
          id: 'author2',
          name: 'author2'
        }
      }
    };
    expect(mutate(originValue, action).posts.edges[0].node.author[1]).toMatchObject({
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
        value: {
          id: 'author1'
        }
      }
    };
    expect(mutate(originValue, action).posts.edges[0].node.author.length).toEqual(0);
  });

  test('disconnect and delete', () => {
    const action = {
      type: 'DISCONNECT_AND_DELETE',
      payload: {
        key: 'posts',
        id: 'post1',
        path: 'author',
        value: {
          id: 'author1'
        }
      }
    };
    expect(mutate(originValue, action).posts.edges[0].node.author.length).toEqual(0);
  })
})