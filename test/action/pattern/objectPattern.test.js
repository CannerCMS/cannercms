import ObjectPattern from '../../../src/action/pattern/objectPattern';
const value = {
  person: {
    name: 'name',
    nickname: 'nickname',
    communicationInfo: {
      address: 'zzz',
      phone: ['xxx', 'yyy']
    }
  }
}


const action1 = {
  type: 'UPDATE_OBJECT',
  paylaod: {
    key: 'person',
    path: '',
    value: {
      name: 'name'
    }
  }
}

const action2 = {
  type: 'UPDATE_OBJECT',
  payload: {
    key: 'person',
    path: 'nickname',
    value: 'nickname'
  }
}

const action3 = {
  type: 'UPDATE_OBJECT',
  payload: {
    key: 'person',
    path: 'communicationInfo/address',
    value: 'zzz'
  }
}

const action4 = {
  type: 'UPDATE_OBJECT',
  payload: {
    key: 'person',
    path: 'communicationInfo/phone',
    value: ['1', '2']
  }
}

describe('object pattern', () => {

  it('should merge actions everytime', () => {
    const pattern = new ObjectPattern();
    pattern.addPattern(action1);
    expect(pattern.getActions().length).toBe(1);
    pattern.addPattern(action2);
    expect(pattern.getActions().length).toBe(1);
    pattern.addPattern(action3);
    expect(pattern.getActions().length).toBe(1);
    pattern.addPattern(action4);
    expect(pattern.getActions().length).toBe(1);
    expect(pattern.getActions()[0]).toEqual(value);
  });
});
