import actionsToVariables, { findSchema, addPath } from '../../src/action/actionsToVariables';

const schema = {
  posts: {
    type: 'array',
    keyName: 'posts',
    path: 'posts',
    items: {
      items: {}
    }
  },
  info: {
    type: 'object',
    keyName: 'info',
    items: {
      jsonField: {
        keyName: 'jsonField',
        type: 'json',
        items: {
          images: {
            keyName: 'images',
            type: 'array',
            items: {
              type: 'string'
            }
          }
        }
      }
    }
  },
  authors: {
    type: 'array',
    keyName: 'authors',
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
    value: {
      "title": "123"
    }
  }
};

const updateArrayWithNestedArrayAction = {
  type: 'UPDATE_ARRAY',
  payload: {
    id: 'post1',
    key: 'posts',
    value: {
      name: '321',
      tags: ['1', '2'],
      info: {
        images: [{
          url: 'url1'
        }]
      }
    }
  }
}

const createArrayAction = {
  type: 'CREATE_ARRAY',
  payload: {
    id: 'post2',
    key: 'posts',
    value: {
      "title": "123"
    }
  }
};

const deleteArrayAction = {
  type: 'DELETE_ARRAY',
  payload: {
    id: 'post3',
    key: 'posts',
    value: {}
  }
}

const updateObjectAction = {
  type: 'UPDATE_OBJECT',
  payload: {
    key: 'info',
    value: {
      name: '321'
    }
  }
}

const updateJSONWithNestedArrayAction = {
  type: 'UPDATE_OBJECT',
  payload: {
    key: 'info',
    value: {
      jsonField: {
        images: []
      }
    }
  }
}

const updateObjectWithNestedArrayAction = {
  type: 'UPDATE_OBJECT',
  payload: {
    key: 'info',
    value: {
      name: '321',
      tags: ['1', '2'],
      info: {
        images: [{
          url: 'url1'
        }]
      }
    }
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
    value: {
      id: 'id1',
      name: 'newAuthor'
    }
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
    value: {
      id: 'id1',
      name: 'newAuthor'
    }
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
    value: {
      id: 'id1',
      name: 'newAuthor'
    }
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
    value: {
      id: 'id1',
      name: 'newAuthor'
    }
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
    value: {
      id: '67428a37-107a-4a59-811d-15810c7c49a9'
    }
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
    value: {
      id: '67428a37-107a-4a59-811d-15810c7c49a9'
    }
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
    value: {
      id: '67428a37-107a-4a59-811d-15810c7c49a9'
    }
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
    value: {
      id: '67428a37-107a-4a59-811d-15810c7c49a9'
    }
  }
}

describe('single action to variable', () => {
  test('update array', () => {
    expect(actionsToVariables([updateArrayAction], schema))
      .toMatchObject({
        payload: updateArrayAction.payload.value,
        where: {id: updateArrayAction.payload.id}
      });
  });

  test('update nested array in array', () => {
    const value = updateArrayWithNestedArrayAction.payload.value;
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
        payload: createArrayAction.payload.value
      });
  });

  test('update nested array in json field should not use `set`', () => {
    const value = updateJSONWithNestedArrayAction.payload.value;
    expect(actionsToVariables([updateJSONWithNestedArrayAction], schema))
      .toMatchObject({
        payload: value,
        where: {id: updateObjectWithNestedArrayAction.payload.id}
      });
  });

  test('update nested array in object', () => {
    const value = updateObjectWithNestedArrayAction.payload.value;
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
        payload: deleteArrayAction.payload.value
      })
  });

  test('update object', () => {
    expect(actionsToVariables([updateObjectAction], schema))
      .toMatchObject({
        payload: updateObjectAction.payload.value
      });
  })

  test('connect to one', () => {
    expect(actionsToVariables([connectToOneAction], schema))
      .toMatchObject({
        payload: {
          [connectToOneAction.payload.path]: {
            connect: {
              id: connectToOneAction.payload.value.id
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
              id: connectToManyAction.payload.value.id
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
              id: createAndConnectToOneAction.payload.value.id
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
              id: createAndConnectToManyAction.payload.value.id
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
              id: disconnectToManyAction.payload.value.id
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
              id: disconnectAndDeleteToManyAction.payload.value.id
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

describe('find schema', () => {
  const schema = {
    type: 'array',
    keyName: 'posts',
    items: {
      type: 'object',
      items: {
        images: {
          type: 'array',
          items: {
            type: 'object',
            items: {
              image: {
                type: 'image'
              }
            }
          }
        }
      }
    }
  }

  it('should find 2 array', () => {
    expect(findSchema(schema, schema => schema.type === 'array').length).toBe(2);
  });

  it('should find 2 object', () => {
    expect(findSchema(schema, schema => schema.type === 'object').length).toBe(2);
  });

  it('should find 1 image', () => {
    expect(findSchema(schema, schema => schema.type === 'image').length).toBe(1);
  });
});

describe('addPath', () => {
  it('should add path in every field', () => {
    const schema = {
      keyName: 'posts',
      type: 'array',
      items: {
        type: 'object',
        items: {
          title: {
            keyName: 'title',
            type: 'string'
          },
          content: {
            keyName: 'content',
            type: 'editor'
          },
          images: {
            keyName: 'images',
            type: 'array',
            items: {
              type: 'object',
              items: {
                image: {
                  keyName: 'image',
                  type: 'image'
                }
              }
            }
          }
        }
      }
    };
    expect(addPath(schema, '')).toMatchObject({
      keyName: 'posts',
      type: 'array',
      path: 'posts',
      items: {
        type: 'object',
        items: {
          title: {
            path: 'posts/title',
            keyName: 'title',
            type: 'string'
          },
          content: {
            path: 'posts/content',
            keyName: 'content',
            type: 'editor'
          },
          images: {
            path: 'posts/images',
            type: 'array',
            keyName: 'images',
            items: {
              type: 'object',
              items: {
                image: {
                  path: 'posts/images/image',
                  type: 'image'
                }
              }
            }
          }
        }
      }
    });
  });
})
