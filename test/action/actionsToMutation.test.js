import actionToMutation from '../../src/action/actionToMutation';
import {fromJS} from 'immutable';
import {get} from 'lodash';

describe('actions to variables', () => {
  it('update array', () => {
    const updateAction = {
      type: 'UPDATE_ARRAY',
      payload: {
        key: 'posts',
        id: 'id1',
        value: fromJS({
          "title": "123"
        })
      }
    }

    expect(get(actionToMutation(updateAction), 'mutation.fields.updatePost')).toEqual({
      args: {
        data: '$payload',
        where: '$where'
      }
    });
  });

  it('create array', () => {
    const updateAction = {
      type: 'CREATE_ARRAY',
      payload: {
        key: 'posts',
        id: 'id1',
        value: fromJS({
          "title": "123"
        })
      }
    }

    expect(get(actionToMutation(updateAction), 'mutation.fields.createPost')).toEqual({
      args: {
        data: '$payload',
        where: '$where'
      }
    });
  });

  it('delete array', () => {
    const updateAction = {
      type: 'DELETE_ARRAY',
      payload: {
        key: 'posts',
        id: 'id1',
        value: fromJS({
          "title": "123"
        })
      }
    }

    expect(get(actionToMutation(updateAction), 'mutation.fields.deletePost')).toEqual({
      args: {
        data: '$payload',
        where: '$where'
      }
    });
  });

  it('update object', () => {
    const updateAction = {
      type: 'UPDATE_OBJECT',
      payload: {
        key: 'user',
        value: fromJS({
          "title": "123"
        })
      }
    }

    expect(get(actionToMutation(updateAction), 'mutation.fields.updateUser')).toEqual({
      args: {
        data: '$payload',
        where: '$where'
      }
    });
  });
});