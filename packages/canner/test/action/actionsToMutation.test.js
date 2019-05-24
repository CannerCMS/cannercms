import { get } from 'lodash';
import gql from 'graphql-tag';
import actionToMutation from '../../src/action/actionToMutation';
import { objectToQueries } from '../../src/query/utils';

describe('actions to variables', () => {
  it('update array', () => {
    const updateAction = {
      type: 'UPDATE_ARRAY',
      payload: {
        key: 'posts',
        id: 'id1',
        value: {
          title: '123',
        },
      },
    };

    expect(get(actionToMutation(updateAction), 'mutation.args')).toEqual({
      $payload: 'PostUpdateInput!',
      $where: 'PostWhereUniqueInput!',
    });

    expect(get(actionToMutation(updateAction), 'mutation.fields.updatePost')).toEqual({
      args: {
        data: '$payload',
        where: '$where',
      },
      fields: {
        id: null,
      },
    });
  });

  it('create array', () => {
    const updateAction = {
      type: 'CREATE_ARRAY',
      payload: {
        key: 'posts',
        id: 'id1',
        value: {
          title: '123',
        },
      },
    };

    expect(get(actionToMutation(updateAction), 'mutation.args')).toEqual({
      $payload: 'PostCreateInput!',
    });

    expect(get(actionToMutation(updateAction), 'mutation.fields.createPost')).toEqual({
      args: {
        data: '$payload',
      },
      fields: {
        id: null,
      },
    });
  });

  it('delete array', () => {
    const updateAction = {
      type: 'DELETE_ARRAY',
      payload: {
        key: 'posts',
        id: 'id1',
        value: {
          title: '123',
        },
      },
    };

    expect(get(actionToMutation(updateAction), 'mutation.args')).toEqual({
      $where: 'PostWhereUniqueInput!',
    });

    expect(get(actionToMutation(updateAction), 'mutation.fields.deletePost')).toEqual({
      args: {
        where: '$where',
      },
      fields: {
        id: null,
      },
    });
  });

  it('update object', () => {
    const updateAction = {
      type: 'UPDATE_OBJECT',
      payload: {
        key: 'user',
        value: {
          title: '123',
        },
      },
    };

    expect(get(actionToMutation(updateAction), 'mutation.args')).toEqual({
      $payload: 'UserUpdateInput!',
    });

    expect(get(actionToMutation(updateAction), 'mutation.fields.updateUser')).toEqual({
      args: {
        data: '$payload',
      },
      fields: {
        __typename: null,
      },
    });
  });
});

describe('integration', () => {
  test('should works', () => {
    const updateAction = {
      type: 'UPDATE_OBJECT',
      payload: {
        key: 'user',
        value: {
          title: '123',
        },
      },
    };
    const mutation = objectToQueries(actionToMutation(updateAction), false);
    expect(() => gql`${mutation}`).not.toThrow();
  });
});
