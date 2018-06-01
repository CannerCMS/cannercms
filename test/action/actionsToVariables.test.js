import actionsToVariables from '../../src/action/actionsToVariables';
import {fromJS} from 'immutable';

const updateArrayAction = {
  type: 'UPDATE_ARRAY',
  payload: {
    id: 'post1',
    value: fromJS({
      "title": "123"
    })
  }
};

const updateArrayActionWithNestedArrayAction = {
  type: 'UPDATE_Array',
  payload: {
    id: 'post1',
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
    value: fromJS({
      "title": "123"
    })
  }
};

const deleteArrayAction = {
  type: 'DELETE_ARRAY',
  payload: {
    id: 'post3',
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

const updateObjectActionWithNestedArrayAction = {
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

const createAndConnectAction = {
  type: 'CREATE_AND_CONNECT',
  payload: {
    id: 'post1',
    path: 'author',
    value: fromJS({
      name: 'newAuthor'
    })
  }
}

const disconnectAction = {
  type: 'DISCONNECT',
  payload: {
    id: 'post1',
    path: 'author',
    value: fromJS({
      id: '67428a37-107a-4a59-811d-15810c7c49a9'
    })
  }
}

describe('single action to variable', () => {
  test('update array', () => {
    expect(actionsToVariables([updateArrayAction]))
      .toMatchObject({
        payload: updateArrayAction.payload.value.toJS(),
        where: {id: updateArrayAction.payload.id}
      });
  });

});

describe('multiple actions to variables', () => {
  test('should works', () => {
    expect(actionsToVariables([
      updateArrayAction,
      createAndConnectAction,
      disconnectAction
    ])).toMatchObject({
      "payload": {
        "title": "123",
        "author": {
            "create": {
              "name": "newAuthor"
            },
            "disconnect": {
              "id": "67428a37-107a-4a59-811d-15810c7c49a9"
            }
          }
      },
      "where": {
        'id': 'post1'
      }
    })
  });
});

