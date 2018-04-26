import {generateAction} from '../../src/action/generateAction';

const rootValue = {
  user: {
    name: 'name',
    info: {
      address: {
        lat: 23,
        lng: 120
      },
      phone: [
        {type: 'H', value: 'xxx'},
        {type: 'C', value: 'yyy'}
      ]
    }
  },
  posts: [{
    id: 'id1',
    title: 'title1',
    comment: [{
      text: 'xxx',
      author: 'xxx'
    }, {
      text: 'yyy',
      author: 'yyy'
    }],
    users: [{}]
  }, {
    id: 'id1',
    title: 'title1',
    comment: [{
      text: 'xxx',
      author: 'xxx'
    }, {
      text: 'yyy',
      author: 'yyy'
    }],
    users: [{name: 'name1'}, {name: 'name2'}]
  }],
}

describe('update action', () => {
  it('update an array item without path', () => {
    const action = generateAction({
      id: 'posts/0',
      updateType: 'update',
      value: {
        title: 'newTitle'
      },
      rootValue,
    });
    expect(action).toEqual({
      type: 'UPDATE_ARRAY',
      paylaod: {
        key: 'posts',
        id: '0',
        value: {
          title: 'newTitle'
        }
      }
    });
  });

  it('update an array item with path', () => {
    const action = generateAction({
      id: 'posts/0/comment/0/text',
      updateType: 'update',
      value: 'zzz',
      rootValue,
    });
    expect(action).toEqual({
      type: 'UPDATE_ARRAY',
      paylaod: {
        key: 'posts',
        id: '0',
        path: 'comment/0/text',
        value: {
          title: 'zzz'
        }
      }
    });
  });

  it('update object with path', () => {
    const action = generateAction({
      id: 'user/info/phone/0/type',
      updateType: 'update',
      value: 'C',
      rootValue,
    });
    expect(action).toEqual({
      type: 'UPDATE_OBJECT',
      paylaod: {
        key: 'user',
        path: 'info/phone/0/type',
        value: {
          title: 'C'
        }
      }
    });
  })

  it('update object withour path', () => {
    const action = generateAction({
      id: 'user',
      updateType: 'update',
      value: {
        name: 'newName'
      },
      rootValue,
    });
    expect(action).toEqual({
      type: 'UPDATE_OBJECT',
      paylaod: {
        key: 'user',
        value: {
          name: 'newName'
        }
      }
    });
  });
});

describe('create action', () => {
  it('create root array item', () => {
    const action = generateAction({
      id: 'posts',
      updateType: 'create',
      value: {
        title: '',
        comments: [],
        users: []
      },
      rootValue,
    });
    expect(action).toEqual({
      type: 'CREATE_ARRAY',
      paylaod: {
        key: 'posts',
        value: {
          title: '',
          comments: [],
          users: []
        }
      }
    });
  });

  it('create array item in array', () => {
    const action = generateAction({
      id: 'posts/0/users',
      updateType: 'create',
      value: {
        name: ''
      },
      rootValue,
    });
    expect(action).toEqual({
      type: 'UPDATE_ARRAY',
      paylaod: {
        key: 'posts',
        id: '0',
        path: 'users',
        value: [{
          name: ''
        }]
      }
    });
  });

  it('create array item in object', () => {
    const action = generateAction({
      id: 'user/info/phone',
      updateType: 'create',
      value: {
        type: '',
        value: ''
      },
      rootValue,
    });
    expect(action).toEqual({
      type: 'UPDATE_OBJECT',
      paylaod: {
        key: 'user',
        path: 'info/phone',
        value: [{
          type: 'H',
          value: 'xxx'
        }, {
          type: 'C',
          value: 'yyy'
        }, {
          type: '',
          value: ''
        }]
      }
    });
  });

  it('create a relation array item', () => {
    const action = generateAction({
      id: 'posts/0/users',
      updateType: 'create',
      value: {
        name: ''
      },
      relation: {
        to: 'users',
        type: 'toMany'
      },
      rootValue,
    });
    expect(action).toEqual({
      type: 'CREATE_AND_CONNECT',
      paylaod: {
        key: 'posts',
        id: '0',
        path: 'users',
        value: {
          name: ''
        }
      }
    });
  });
});

describe('delete action', () => {
  it('delete root array item', () => {
    const action = generateAction({
      id: 'posts/0',
      updateType: 'delete',
      rootValue,
    });
    expect(action).toEqual({
      type: 'DELETE_ARRAY',
      paylaod: {
        key: 'posts',
        id: '0',
      }
    });
  });

  it('delete array item in array', () => {
    const action = generateAction({
      id: 'posts/0/users/0',
      updateType: 'delete',
      rootValue,
    });
    expect(action).toEqual({
      type: 'UPDATE_ARRAY',
      paylaod: {
        key: 'posts',
        id: '0',
        path: 'users',
        value: [{
          name: 'name2'
        }]
      }
    });
  });

  it('delete array item in object', () => {
    const action = generateAction({
      id: 'user/info/phone/1',
      updateType: 'delete',
      rootValue,
    });
    expect(action).toEqual({
      type: 'UPDATE_OBJECT',
      paylaod: {
        key: 'user',
        path: 'info/phone',
        value: [{
          text: 'H',
          value: 'xxx'
        }]
      }
    });
  });

  it('delete a relation array item', () => {
    const action = generateAction({
      id: 'posts/0/users',
      updateType: 'delete',
      value: {
        id: 'user2'
      },
      relation: {
        to: 'users',
        type: 'toMany'
      },
      rootValue,
    });
    expect(action).toEqual({
      type: 'DISCONNECT_AND_DELETE',
      paylaod: {
        key: 'posts',
        id: '0',
        path: 'users',
        value: {
          id: 'user2'
        }
      }
    });
  });
});

describe('swap action', () => {
  it('swap root array item should throw', () => {
    expect(() => generateAction({
      id: {
        firstId: 'posts/0',
        secondId: 'posts/1'
      },
      updateType: 'swap',
      rootValue
    })).toThrow();
  });

  it('swap array item in array itme', () => {
    const action = generateAction({
      id: {
        firstId: 'posts/0/users/0',
        secondId: 'posts/0/users/1',
      },
      updateType: 'swap',
      rootValue
    });
    expect(action).toEqual({
      type: 'UPDATE_ARRAY',
      payload: {
        key: 'posts',
        id: '0',
        path: 'users',
        value: [{
          name: 'name2'
        }, {
          name: 'name1'
        }]
      }
    });
  });

  it('swap array item in object', () => {
    const action = generateAction({
      id: {
        firstId: 'user/info/phone/0',
        secondId: 'user/info/phone/1',
      },
      updateType: 'swap',
      rootValue
    });
    expect(action).toEqual({
      type: 'UPDATE_OBJECT',
      payload: {
        key: 'user',
        path: 'phone',
        value: [{
          type: 'C',
          value: 'yyy'
        }, {
          type: 'H',
          value: 'xxx'
        }]
      }
    });
  });
});

describe('connect action', () => {
  it('connect relation array itme', () => {
    const action = generateAction({
      id: 'posts/0/users',
      updateType: 'connect',
      value: {
        id: 'id1'
      }
    });
    expect(action).toEqual({
      type: 'CONNECT',
      payload: {
        key: 'posts',
        id: '0',
        path: 'users',
        payload: {
          id: 'id1'
        }
      }
    });
  });
});

describe('disconnect action', () => {
  it('disconnect relation array item', () => {
    const action = generateAction({
      id: 'posts/0/users',
      updateType: 'disconnect',
      value: {
        id: 'id1'
      }
    });
    expect(action).toEqual({
      type: 'DISCONNECT',
      payload: {
        key: 'posts',
        id: '0',
        path: 'users',
        payload: {
          id: 'id1'
        }
      }
    });
  });
});