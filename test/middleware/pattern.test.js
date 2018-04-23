import createPattern from '../../src/app/middleware/bucket/pattern';
import {fromJS} from 'immutable';
import {UNIQUE_ID} from '../../src/app/config';

const createArrayAction1 = {
  type: 'CREATE_ARRAY_ITEM',
  payload: {
    path: '',
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
    path: '',
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
    path: '',
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

const updateArrayNameAction = {
  tpye: 'UPDATE_ARRAY',
  payload: {
    path: 'name',
    id: 1,
    value: 23,
    mutatedValue: fromJS({
      [UNIQUE_ID]: 1,
      name: 23,
    })
  }
}

const deleteArrayAction1 = {
  type: 'DELETE_ARRAY_ITEM',
  payload: {
    path: '',
    id: 1,
    value: fromJS({
      [UNIQUE_ID]: 1,
      name: 123,
    }),
  },
};

describe('removeUpdateBeforeDelete', () => {
  it('should leave the delete action', () => {
    // different id would not be merged
    const pattern = createPattern(updateArrayAction1);
    pattern.addAction(updateArrayAction1);
    pattern.addAction(updateArrayAction1);
    pattern.addAction(deleteArrayAction1);
    pattern.removeUpdateBeforeDelete();
    expect(pattern.actions.length).toEqual(1);
    expect(pattern.actions[0].type).toBe('DELETE_ARRAY_ITEM');
  });
});

describe('removeCreateBeforeDelete', () => {
  it('should remove all actions', () => {
    const pattern = createPattern(createArrayAction1);
    pattern.addAction(deleteArrayAction1);
    pattern.removeCreateBeforeDelete();
    expect(pattern.actions.length).toEqual(0);
  });
});

describe('mergeMultiCollectionUpdate', () => {
  it('should leave one update action', () => {
    const pattern = createPattern(updateArrayAction1);
    pattern.addAction(updateArrayAction1);
    pattern.addAction(updateArrayAction2);
    pattern.mergeMultiCollectionUpdate();
    expect(pattern.actions.length).toEqual(1);
    expect(pattern.actions[0].type).toBe('UPDATE_ARRAY');
    expect(pattern.actions[0].payload.value.toJS()).toEqual(updateArrayAction2.payload.value.toJS());
  });
});

describe('mergeUpdateAfterCreate', () => {
  it('shoule leave one create action and merge payload', () => {
    const pattern = createPattern(createArrayAction1);
    pattern.addAction(updateArrayAction1);
    pattern.addAction(updateArrayAction2);
    pattern.mergeUpdateAfterCreate();
    expect(pattern.actions.length).toEqual(1);
    expect(pattern.actions[0].payload.value.toJS()).toEqual(updateArrayAction2.payload.value.toJS());
  });

  it('should be the same action', () => {
    const pattern = createPattern(updateArrayNameAction);
    pattern.mergeUpdateAfterCreate();
    expect(pattern.actions.length).toBe(1);
    expect(pattern.actions[0].payload.value).toBe(updateArrayNameAction.payload.value);
    expect(pattern.actions[0].payload.path).toBe(updateArrayNameAction.payload.path);
  })
});
