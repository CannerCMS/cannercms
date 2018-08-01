import ObjectPattern from '../../../src/action/pattern/objectPattern';
import {fromJS} from 'immutable';

const value = {
  name: 'name',
  nickname: 'nickname',
  communicationInfo: {
    address: 'zzz',
    phone: ['xxx', 'yyy']
  }
};


const action1 = {
  type: 'UPDATE_OBJECT',
  payload: {
    key: 'person',
    value: fromJS({
      name: 'name'
    })
  }
}

const action2 = {
  type: 'UPDATE_OBJECT',
  payload: {
    key: 'person',
    value: fromJS({
      nickname: 'nickname'
    })
  }
}

const action3 = {
  type: 'UPDATE_OBJECT',
  payload: {
    key: 'person',
    value: fromJS({
      communicationInfo: {
        address: 'zzz',
        phone: ['xxx', 'yyy']
      }
    })
  }
}

describe('object pattern', () => {

  it('should merge actions everytime', () => {
    const pattern = new ObjectPattern();
    pattern.addAction(action1);
    expect(pattern.getActions().length).toBe(1);
    pattern.addAction(action2);
    expect(pattern.getActions().length).toBe(1);
    pattern.addAction(action3);
    expect(pattern.getActions().length).toBe(1);
    expect(pattern.getActions()[0].payload.value.toJS()).toEqual(value);
  });
});
