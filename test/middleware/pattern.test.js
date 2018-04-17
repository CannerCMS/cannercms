import createPattern from '../../src/app/middleware/bucket/pattern';
import {fromJS} from 'immutable';
import {UNIQUE_ID} from '../../src/app/config';

const createArrayAction1 = {
  type: 'CREATE_ARRAY_ITEM',
  payload: {
    path: 'posts/1',
    id: 1,
    value: fromJS({
      [UNIQUE_ID]: 1,
      name: 1,
    }),
  },
};

const updateArrayAction1 = {
  type: 'UPDATE_ARRAY',
  payload: {
    path: 'posts/1',
    id: 1,
    value: fromJS({
      [UNIQUE_ID]: 1,
      name: 11,
    }),
    mutatedValue: fromJS({
      [UNIQUE_ID]: 1,
      name: 11,
    })
  },
};

const updateArrayAction2 = {
  type: 'UPDATE_ARRAY',
  payload: {
    path: 'posts/1',
    id: 1,
    value: fromJS({
      [UNIQUE_ID]: 1,
      name: 22,
    }),
    mutatedValue: fromJS({
      [UNIQUE_ID]: 1,
      name: 22,
    })
  },
};

const deleteArrayAction1 = {
  type: 'DELETE_ARRAY_ITEM',
  payload: {
    path: 'posts/1',
    id: 1,
    value: fromJS({
      [UNIQUE_ID]: 1,
      name: 123,
    }),
  },
};

describe('collection pattern', () => {
  it('removeUpdateBeforeDelete', () => {
    // different id would not be merged
    const pattern = createPattern(updateArrayAction1);
    pattern.addAction(updateArrayAction1);
    pattern.addAction(updateArrayAction1);
    pattern.addAction(deleteArrayAction1);
    pattern.removeUpdateBeforeDelete();
    expect(pattern.actions.length).toEqual(1);
  });

  it('removeCreateBeforeDelete', () => {
    const pattern = createPattern(createArrayAction1);
    pattern.addAction(deleteArrayAction1);
    pattern.removeCreateBeforeDelete();
    expect(pattern.actions.length).toEqual(0);
  });

  it('mergeMultiCollectionUpdate', () => {
    const pattern = createPattern(updateArrayAction1);
    pattern.addAction(updateArrayAction1);
    pattern.addAction(updateArrayAction2);
    pattern.mergeMultiCollectionUpdate();
    expect(pattern.actions.length).toEqual(1);
    expect(pattern.actions[0].payload.value.toJS()).toEqual(updateArrayAction2.payload.value.toJS());
  });

  it('mergeUpdateAfterCreate', () => {
    const pattern = createPattern(createArrayAction1);
    pattern.addAction(updateArrayAction1);
    pattern.addAction(updateArrayAction2);
    pattern.mergeUpdateAfterCreate();
    expect(pattern.actions.length).toEqual(1);
    expect(pattern.actions[0].payload.value.toJS()).toEqual(updateArrayAction2.payload.value.toJS());
  });
});
