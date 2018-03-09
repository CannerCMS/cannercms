/* eslint-disable no-unused-vars */

import {Bucket} from '../../src/middleware';
import {fromJS} from 'immutable';
import {UNIQUE_ID} from '../../src/config';
import {List} from 'immutable';

const createArrayAction1 = {
  type: 'CREATE_ARRAY_ITEM',
  payload: {
    key: 'posts',
    id: '1',
    value: fromJS({
      [UNIQUE_ID]: '1',
      name: 123,
    }),
  },
};

const createArrayAction2 = {
  type: 'CREATE_ARRAY_ITEM',
  payload: {
    key: 'posts',
    id: '2',
    value: fromJS({
      [UNIQUE_ID]: '2',
      name: 123,
    }),
  },
};

const updateArrayAction1 = {
  type: 'UPDATE_ARRAY',
  payload: {
    key: 'posts',
    id: '1',
    value: fromJS({
      [UNIQUE_ID]: '1',
      name: 123,
    }),
  },
};

const updateArrayAction2 = {
  type: 'UPDATE_ARRAY',
  payload: {
    key: 'posts',
    id: '2',
    value: fromJS({
      [UNIQUE_ID]: '2',
      name: 123,
    }),
  },
};

const deleteArrayAction1 = {
  type: 'DELETE_ARRAY_ITEM',
  payload: {
    key: 'posts',
    id: '1',
    value: fromJS({
      [UNIQUE_ID]: '1',
      name: 123,
    }),
  },
};

const updateObjectAction1 = {
  type: 'UPDATE_OBJECT',
  payload: {
    key: 'info',
    path: '',
    value: fromJS({
      name: 123,
      category: ['1', 'a', 'b'],
    }),
  },
};

const deleteArrayNestedItemAction = {
  type: 'DELETE_ARRAY_NESTED_ITEM',
  payload: {
    key: 'posts',
    id: '1',
    path: 'authors/0',
    value: fromJS([{
      [UNIQUE_ID]: '1',
      authors: [{
        name: 'author1'
      }]
    }])
  }
}

const createArrayNestedItemAction = {
  type: 'CREATE_ARRAY_NESTED_ITEM',
  payload: {
    key: 'posts',
    id: '1',
    path: 'authors',
    value: fromJS([{
      [UNIQUE_ID]: '1',
      authors: []
    }])
  }
}

const deleteObjectNestedItemAction = {
  type: 'DELETE_OBJECT_NESTED_ITEM',
  payload: {
    key: 'info',
    path: 'authors/0',
    value: fromJS({
      authors: [{
        name: 'author1'
      }]
    })
  }
}

const createObjectNestedItemAction = {
  type: 'CREATE_OBJECT_NESTED_ITEM',
  payload: {
    key: 'info',
    path: 'authors',
    value: fromJS({
      authors: []
    })
  }
}

const swapArrayNestedItemAction = {
  type: 'SWAP_ARRAY_NESTED_ITEM',
  payload: {
    key: 'posts',
    id: '1',
    path: 'authors',
    value: fromJS([{
      [UNIQUE_ID]: '1',
      authors: [{name: 'author1'}, {name: 'author2'}]
    }])
  }
}

const swapObjectNestedItemAction = {
  type: 'SWAP_OBJECT_NESTED_ITEM',
  payload: {
    key: 'info',
    path: 'authors',
    value: fromJS({
      authors: [{name: 'author1'}, {name: 'author2'}]
    })
  }
}

describe('bucket transform action', () => {

});

describe('bucket actions optimize', () => {
  it('handleChange write', () => {
    // different id would not be merged
    const bucket = new Bucket();
    const request = {
      type: 'write',
      key: 'posts',
      action: {
        type: 'UPDATE_ARRAY',
        payload: {
          key: 'posts',
          id: '0',
          value: fromJS({
            [UNIQUE_ID]: '0',
            name: 123,
          }),
        },
      },
    };
    bucket.handleChange({request, body: {}}, () => {});
    expect(bucket._mergeActions().length).toEqual(1);
  });

  it('multi update: update should be merged', () => {
    // different id would not be merged
    const bucket = new Bucket();
    bucket.addAction(updateArrayAction1);
    bucket.addAction(updateArrayAction2);
    bucket.addAction(updateArrayAction1);
    bucket.addAction(updateArrayAction2);
    expect(bucket._mergeActions().length).toEqual(2);
  });

  it('delete after update (same id): update should be remove', () => {
    const bucket = new Bucket();
    bucket.addAction(updateArrayAction1);
    bucket.addAction(deleteArrayAction1);
    expect(bucket._mergeActions().length).toEqual(1);
  });

  it('delete after update (different id): update should be merged', () => {
    const bucket = new Bucket();
    bucket.addAction(updateArrayAction2);
    bucket.addAction(updateArrayAction2);
    bucket.addAction(updateArrayAction2);
    bucket.addAction(deleteArrayAction1);
    expect(bucket._mergeActions().length).toEqual(2);
  });

  it('delete after create (same id): should be remove', () => {
    const bucket = new Bucket();
    bucket.addAction(createArrayAction1);
    bucket.addAction(updateArrayAction1);
    bucket.addAction(updateArrayAction1);
    bucket.addAction(deleteArrayAction1);
    expect(bucket._mergeActions().length).toEqual(0);
  });

  it('delete after create (different id): merge the update', () => {
    const bucket = new Bucket();
    bucket.addAction(createArrayAction2);
    bucket.addAction(updateArrayAction2);
    bucket.addAction(updateArrayAction2);
    bucket.addAction(deleteArrayAction1);
    expect(bucket._mergeActions().length).toEqual(2);
  });

  it('update after create: should be merged', () => {
    const bucket = new Bucket();
    bucket.addAction(createArrayAction1); // preserved
    bucket.addAction(updateArrayAction1); // merge
    bucket.addAction(updateArrayAction1); // merge
    bucket.addAction(updateArrayAction1); // merge
    bucket.addAction(updateArrayAction1); // merge
    expect(bucket._mergeActions().length).toEqual(1);
  });

  it('map update actions: should be merge', () => {
    const bucket = new Bucket();
    bucket.addAction(updateObjectAction1);
    bucket.addAction(updateObjectAction1);
    bucket.addAction(updateObjectAction1);
    expect(bucket._mergeActions().length).toEqual(1);
  });

  it('complex actions: should be merged', () => {
    const bucket = new Bucket();
    bucket.addAction(createArrayAction1); // delete
    bucket.addAction(updateArrayAction1); // delete
    bucket.addAction(updateArrayAction1); // delete
    bucket.addAction(updateArrayAction1); // delete
    bucket.addAction(createArrayAction2); // merge
    bucket.addAction(updateObjectAction1); // preserved
    bucket.addAction(updateArrayAction2); // merge
    bucket.addAction(updateArrayAction2); // preserved
    bucket.addAction(deleteArrayAction1); // delete
    expect(bucket._mergeActions().length).toEqual(2);
  });
});

describe('mutate data', () => {
  it('create', () => {
    const bucket = new Bucket();
    bucket.addAction(createArrayAction1);
    bucket.addAction(createArrayAction2);
    const newData = bucket.mutateData('posts', new List(), {}, 1);
    expect(newData.toJS()).toEqual([
      createArrayAction1.payload.value.toJS(),
      createArrayAction2.payload.value.toJS(),
    ]);
  });

  it('create and update', () => {
    const bucket = new Bucket();
    bucket.addAction(createArrayAction1);
    bucket.addAction(updateArrayAction1);
    const newData = bucket.mutateData('posts', new List(), {}, 1);
    expect(newData.toJS()).toEqual([
      updateArrayAction1.payload.value.toJS(),
    ]);
  });

  it('delete', () => {
    const bucket = new Bucket();
    bucket.addAction(deleteArrayAction1);
    const newData = bucket.mutateData('posts', new List([
      createArrayAction1.payload.value,
    ]), {}, 1);
    expect(newData.toJS()).toEqual([]);
  });
});

describe('deploy', () => {
  it('remove first action', () => {
    const bucket = new Bucket();
    bucket.addAction(createArrayAction1);
    bucket.addAction(createArrayAction2);
    bucket.addAction(updateObjectAction1);
    expect(bucket._mergeActions().length).toBe(3);
    let actions = bucket._mergeActions();
    bucket.removeFirstAction(actions.shift().payload.key);
    expect(bucket._mergeActions().length).toBe(2);
    actions = bucket._mergeActions();
    bucket.removeFirstAction(actions.shift().payload.key);
    expect(bucket._mergeActions().length).toBe(1);
    actions = bucket._mergeActions();
    bucket.removeFirstAction(actions.shift().payload.key);
    expect(bucket._mergeActions().length).toBe(0);
  });

  it('replace Id', async () => {
    const bucket = new Bucket();
    bucket.addAction(createArrayAction1);
    bucket.addAction(createArrayAction2);
    bucket.addAction(updateObjectAction1);
    const replace = [{
      path: 'posts/_id',
      data: {
        from: '1',
        to: '3',
      },
    }, {
      path: 'posts/_id',
      data: {
        from: '2',
        to: '4',
      },
    }, {
      path: 'info/category',
      data: {
        from: '1',
        to: '2',
      },
    }];
    bucket.replace(replace);
    expect(bucket.bucket.posts.actions[0].payload.id).toBe('3');
    expect(bucket.bucket.posts.actions[0].payload.value.get('_id')).toBe('3');
    expect(bucket.bucket.posts.actions[1].payload.id).toBe('4');
    expect(bucket.bucket.posts.actions[1].payload.value.get('_id')).toBe('4');
    expect(bucket.bucket.info.actions[0].payload.value.get('category').toJS()).toEqual(['2', 'a', 'b']);
  });

  it('handle deploy', async () => {
    const bucket = new Bucket();
    bucket.addAction(createArrayAction1);
    bucket.addAction(createArrayAction2);
    bucket.addAction(updateObjectAction1);
    let ctx = {
      request: {
        type: 'deploy',
      },
      response: {

      },
    };
    await bucket.handleChange(ctx, () => Promise.resolve())
    .then(() => {
      expect(ctx.response.actionsNumber).toBe(2);
    });
    await bucket.handleChange(ctx, () => Promise.resolve())
    .then(() => {
      expect(ctx.response.actionsNumber).toBe(1);
    });
    await bucket.handleChange(ctx, () => Promise.resolve())
    .then(() => {
      expect(ctx.response.actionsNumber).toBe(0);
    });
  });
});
