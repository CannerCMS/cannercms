import actionsToVariables from '../../src/action/actionsToVariables';
import {fromJS} from 'immutable';

const schema = {
  posts: {
    type: 'array',
    items: {
      items: {}
    }
  },
  info: {
    type: 'object',
    items: {
    }
  },
  authors: {
    type: 'array',
    items: {
      items: {}
    }
  }
}

const updateArrayAction = {
  type: 'UPDATE_ARRAY',
  payload: {
    id: 'post1',
    key: 'posts',
    value: fromJS({
      "title": "123"
    })
  }
};

const updateArrayWithNestedArrayAction = {
  type: 'UPDATE_ARRAY',
  payload: {
    id: 'post1',
    key: 'posts',
    value: fromJS({
      name: '321',
      tags: ['1', '2'],
      info: {
        images: [{
          url: 'url1'
        }]
      }
    })
  }
}

const createArrayAction = {
  type: 'CREATE_ARRAY',
  payload: {
    id: 'post2',
    key: 'posts',
    value: fromJS({
      "title": "123"
    })
  }
};

const deleteArrayAction = {
  type: 'DELETE_ARRAY',
  payload: {
    id: 'post3',
    key: 'posts',
    value: fromJS({})
  }
}

const updateObjectAction = {
  type: 'UPDATE_OBJECT',
  payload: {
    key: 'info',
    value: fromJS({
      name: '321'
    })
  }
}

const updateObjectWithNestedArrayAction = {
  type: 'UPDATE_OBJECT',
  payload: {
    key: 'info',
    value: fromJS({
      name: '321',
      tags: ['1', '2'],
      info: {
        images: [{
          url: 'url1'
        }]
      }
    })
  }
}


const connectToOneAction = {
  type: 'CONNECT',
  payload: {
    id: 'post1',
    key: 'posts',
    path: 'author',
    relation: {
      type: 'toOne'
    },
    value: fromJS({
      id: 'id1',
      name: 'newAuthor'
    })
  }
}

const connectToManyAction = {
  type: 'CONNECT',
  payload: {
    id: 'post1',
    key: 'posts',
    path: 'author',
    relation: {
      type: 'toMany'
    },
    value: fromJS({
      id: 'id1',
      name: 'newAuthor'
    })
  }
}

const createAndConnectToOneAction = {
  type: 'CREATE_AND_CONNECT',
  payload: {
    id: 'post1',
    key: 'posts',
    path: 'author',
    relation: {
      type: 'toOne'
    },
    value: fromJS({
      id: 'id1',
      name: 'newAuthor'
    })
  }
}

const createAndConnectToManyAction = {
  type: 'CREATE_AND_CONNECT',
  payload: {
    id: 'post1',
    key: 'posts',
    path: 'author',
    relation: {
      type: 'toMany'
    },
    value: fromJS({
      id: 'id1',
      name: 'newAuthor'
    })
  }
}

const disconnectToOneAction = {
  type: 'DISCONNECT',
  payload: {
    id: 'post1',
    key: 'posts',
    path: 'author',
    relation: {
      type: 'toOne'
    },
    value: fromJS({
      id: '67428a37-107a-4a59-811d-15810c7c49a9'
    })
  }
}


const disconnectToManyAction = {
  type: 'DISCONNECT',
  payload: {
    id: 'post1',
    key: 'posts',
    path: 'author',
    relation: {
      type: 'toMany'
    },
    value: fromJS({
      id: '67428a37-107a-4a59-811d-15810c7c49a9'
    })
  }
}

const disconnectAndDeleteToOneAction = {
  type: 'DISCONNECT_AND_DELETE',
  payload: {
    id: 'post1',
    key: 'posts',
    path: 'author',
    relation: {
      type: 'toOne'
    },
    value: fromJS({
      id: '67428a37-107a-4a59-811d-15810c7c49a9'
    })
  }
}

const disconnectAndDeleteToManyAction = {
  type: 'DISCONNECT_AND_DELETE',
  payload: {
    id: 'post1',
    key: 'posts',
    path: 'author',
    relation: {
      type: 'toMany'
    },
    value: fromJS({
      id: '67428a37-107a-4a59-811d-15810c7c49a9'
    })
  }
}

describe('single action to variable', () => {
  test('update array', () => {
    expect(actionsToVariables([updateArrayAction], schema))
      .toMatchObject({
        payload: updateArrayAction.payload.value.toJS(),
        where: {id: updateArrayAction.payload.id}
      });
  });

  test('update nested array in array', () => {
    const value = updateArrayWithNestedArrayAction.payload.value.toJS();
    expect(actionsToVariables([updateArrayWithNestedArrayAction], schema))
      .toMatchObject({
        payload: {
          ...value,
          tags: {
            set: value.tags
          },
          info: {
            images: {
              set: value.info.images
            }
          }
        },
        where: {id: updateArrayWithNestedArrayAction.payload.id}
      });
  });

  test('create array', () => {
    expect(actionsToVariables([createArrayAction], schema))
      .toMatchObject({
        payload: createArrayAction.payload.value.toJS()
      });
  });

  test('update nested array in object', () => {
    const value = updateObjectWithNestedArrayAction.payload.value.toJS();
    expect(actionsToVariables([updateObjectWithNestedArrayAction], schema))
      .toMatchObject({
        payload: {
          ...value,
          tags: {
            set: value.tags
          },
          info: {
            images: {
              set: value.info.images
            }
          }
        },
        where: {id: updateObjectWithNestedArrayAction.payload.id}
      });
  });

  test('delete array', () => {
    expect(actionsToVariables([deleteArrayAction], schema))
      .toMatchObject({
        payload: deleteArrayAction.payload.value.toJS()
      })
  });

  test('update object', () => {
    expect(actionsToVariables([updateObjectAction], schema))
      .toMatchObject({
        payload: updateObjectAction.payload.value.toJS()
      });
  })

  test('connect to one', () => {
    expect(actionsToVariables([connectToOneAction], schema))
      .toMatchObject({
        payload: {
          [connectToOneAction.payload.path]: {
            connect: {
              id: connectToOneAction.payload.value.toJS().id
            }
          }
        },
        where: {id: connectToOneAction.payload.id}
      })
  });

  test('connect to many', () => {
    expect(actionsToVariables([connectToManyAction], schema))
      .toMatchObject({
        payload: {
          [connectToManyAction.payload.path]: {
            connect: [{
              id: connectToManyAction.payload.value.toJS().id
            }]
          }
        },
        where: {id: connectToManyAction.payload.id}
      })
  });

  test('create and connect to one action', () => {
    expect(actionsToVariables([createAndConnectToOneAction], schema))
      .toMatchObject({
        payload: {
          [createAndConnectToOneAction.payload.path]: {
            create: {
              id: createAndConnectToOneAction.payload.value.toJS().id
            }
          }
        },
        where: {id: createAndConnectToOneAction.payload.id}
      });
  });

  test('create and connect to many action', () => {
    expect(actionsToVariables([createAndConnectToManyAction], schema))
      .toMatchObject({
        payload: {
          [createAndConnectToManyAction.payload.path]: {
            create: [{
              id: createAndConnectToManyAction.payload.value.toJS().id
            }]
          }
        },
        where: {id: createAndConnectToManyAction.payload.id}
      });
  });

  test('disconnect to one', () => {
    expect(actionsToVariables([disconnectToOneAction], schema))
      .toMatchObject({
        payload: {
          [disconnectToOneAction.payload.path]: {
            disconnect: true
          }
        },
        where: {id: disconnectToOneAction.payload.id}
      });
  });

  test('disconnect to many', () => {
    expect(actionsToVariables([disconnectToManyAction], schema))
      .toMatchObject({
        payload: {
          [disconnectToManyAction.payload.path]: {
            disconnect: [{
              id: disconnectToManyAction.payload.value.toJS().id
            }]
          }
        },
        where: {id: disconnectToManyAction.payload.id}
      });
  });

  test('disconnect and delete to one', () => {
    expect(actionsToVariables([disconnectAndDeleteToOneAction], schema))
      .toMatchObject({
        payload: {
          [disconnectAndDeleteToOneAction.payload.path]: {
            delete: true
          }
        },
        where: {id: disconnectAndDeleteToOneAction.payload.id}
      });
  });

  test('disconnect and delete to many', () => {
    expect(actionsToVariables([disconnectAndDeleteToManyAction], schema))
      .toMatchObject({
        payload: {
          [disconnectAndDeleteToManyAction.payload.path]: {
            delete: [{
              id: disconnectAndDeleteToManyAction.payload.value.toJS().id
            }]
          }
        },
        where: {id: disconnectAndDeleteToManyAction.payload.id}
      });
  });

});

describe('multiple actions to variables', () => {
  test('should works', () => {
    expect(actionsToVariables([
      updateArrayAction,
      createAndConnectToOneAction,
      disconnectToOneAction
    ], schema)).toMatchObject({
      "payload": {
        "title": "123",
        "author": {
            "create": {
              "name": "newAuthor"
            },
            "disconnect": true
          }
      },
      "where": {
        'id': 'post1'
      }
    })
  });
});

