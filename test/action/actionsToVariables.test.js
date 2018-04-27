import actionsToVariables from '../../src/action/actionsToVariables';
import {fromJS} from 'immutable';

describe('actions to variables', () => {
  it('should works', () => {
    const updateAction = {
      type: 'UPDATE_ARRAY',
      payload: {
        value: fromJS({
          "title": "123"
        })
      }
    }
    const createAndConnectAction = {
      type: 'CREATE_AND_CONNECT',
      payload: {
        path: 'author',
        value: fromJS({
          name: 'newAuthor'
        })
      }
    }

    const disconnectAction = {
      type: 'DISCONNECT',
      payload: {
        path: 'author',
        value: fromJS({
          id: '67428a37-107a-4a59-811d-15810c7c49a9'
        })
      }
    }

    expect(actionsToVariables([
      updateAction,
      createAndConnectAction,
      disconnectAction
    ])).toEqual({
      "payload": {
        "title": "123",
        "author": {
            "create": [{
              "name": "newAuthor"
            }],
            "disconnect": [{
              "id": "67428a37-107a-4a59-811d-15810c7c49a9"
            }]
          }
      }
    })
  });
});