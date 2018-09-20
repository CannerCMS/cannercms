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
    id: 'id2',
    title: 'title1',
    comment: [{
      text: 'xxx',
      author: 'xxx'
    }, {
      text: 'yyy',
      author: 'yyy'
    }],
    users: [{id: 'user1', name: 'name1'}, {id: 'user2', name: 'name2'}]
  }],
};

describe('update action', () => {
  it('update an array item', () => {
    const action = generateAction({
      id: 'posts/0/comment/0/text',
      updateType: 'update',
      value: 'zzz',
      rootValue,
    });
    expect(action).toMatchObject({
      type: 'UPDATE_ARRAY',
      payload: {
        key: 'posts',
        id: 'id1',
        value: {
          comment: rootValue.posts[0].comment.map((c, index) => {
            if (index === 0) {
              return {...c, text: 'zzz'}
            }
            return c;
          })
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
    const newUser = {...rootValue.user};
    newUser.info.phone[0].type = 'C';
    expect(action).toMatchObject({
      type: 'UPDATE_OBJECT',
      payload: {
        key: 'user',
        id: "",
        value: {info: newUser.info}
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
        id: 'id2',
        title: '',
        comments: [],
        users: []
      },
      rootValue,
    });
    expect(action).toMatchObject({
      type: 'CREATE_ARRAY',
      payload: {
        key: 'posts',
        id: 'id2',
        value: {
          id: 'id2',
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
    const newValue = {...rootValue};
    newValue.posts[0].users.push({name: ''});
    expect(action).toMatchObject({
      type: 'UPDATE_ARRAY',
      payload: {
        key: 'posts',
        id: 'id1',
        value: {users: newValue.posts[0].users}
          
      }
    });
  });

  it('create array item in object', () => {
    const action = generateAction({
      id: 'user/phone',
      updateType: 'create',
      value: {
        type: '',
        value: ''
      },
      rootValue,
    });
    const newUser = {...rootValue.user};
    newUser.info.phone.push({type: '',  value: ''});
    expect(action).toMatchObject({
      type: 'UPDATE_OBJECT',
      payload: {
        key: 'user',
        id: '',
        value: {phone: newUser.phone}
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
    expect(action).toMatchObject({
      type: 'CREATE_AND_CONNECT',
      payload: {
        key: 'posts',
        id: 'id1',
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
    expect(action).toMatchObject({
      type: 'DELETE_ARRAY',
      payload: {
        key: 'posts',
        id: 'id1',
        value: {}
      }
    });
  });

  it('delete array item in array', () => {
    const action = generateAction({
      id: 'posts/1/users/0',
      updateType: 'delete',
      rootValue,
    });
    const newPost1 = {...rootValue.posts[1]};
    newPost1.users.shift();
    expect(action).toMatchObject({
      type: 'UPDATE_ARRAY',
      payload: {
        key: 'posts',
        id: 'id2',
        value: {users: newPost1.users}
      }
    });
  });

  it('delete array item in object', () => {
    const newUser = {...rootValue.user};
    const action = generateAction({
      id: 'user/info/phone/1',
      updateType: 'delete',
      rootValue,
    });
    newUser.info.phone.splice(1, 1);
    expect(action).toMatchObject({
      type: 'UPDATE_OBJECT',
      payload: {
        key: 'user',
        id: '',
        value: {info: newUser.info}
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
    expect(action).toMatchObject({
      type: 'DISCONNECT_AND_DELETE',
      payload: {
        key: 'posts',
        id: 'id1',
        path: 'users',
        value: {
          id: 'user2'
        }
      }
    });
  });
});

describe('swap action', () => {
  it('swap root array item', () => {
    const action = generateAction({
      id: {
        firstId: 'posts/0',
        secondId: 'posts/1'
      },
      updateType: 'swap',
      rootValue
    });
    expect(action).toMatchObject({
      type: 'NOOP',
      payload: {
        key: '',
        value: {}
      }
    });
  });

  it('swap array item in array', () => {
    const action = generateAction({
      id: {
        firstId: 'posts/1/comment/0',
        secondId: 'posts/1/comment/1',
      },
      updateType: 'swap',
      rootValue
    });
    expect(action).toMatchObject({
      type: 'UPDATE_ARRAY',
      payload: {
        key: 'posts',
        id: 'id2',
        value: {
          comment: [{
            text: 'yyy',
            author: 'yyy'
          }, {
            text: 'xxx',
            author: 'xxx'
          }]
        }
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
    const newUser = {...rootValue.user};
    newUser.info.phone = [{
      type: 'C',
      value: 'yyy'
    }, {
      type: 'H',
      value: 'xxx'
    }];
    expect(action).toMatchObject({
      type: 'UPDATE_OBJECT',
      payload: {
        key: 'user',
        id: '',
        value: {info: newUser.info}
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
      },
      rootValue,
      relation: {}
    });
    expect(action).toMatchObject({
      type: 'CONNECT',
      payload: {
        key: 'posts',
        id: 'id1',
        path: 'users',
        value: {
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
      },
      rootValue,
      relation: {}
    });
    expect(action).toMatchObject({
      type: 'DISCONNECT',
      payload: {
        key: 'posts',
        id: 'id1',
        path: 'users',
        value: {
          id: 'id1'
        }
      }
    });
  });
});
