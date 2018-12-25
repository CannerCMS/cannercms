import ObjectPattern from '../../../src/action/pattern/objectPattern';

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
    value: {
      name: 'name'
    }
  }
}

const action2 = {
  type: 'UPDATE_OBJECT',
  payload: {
    key: 'person',
    value: {
      nickname: 'nickname'
    }
  }
}

const action3 = {
  type: 'UPDATE_OBJECT',
  payload: {
    key: 'person',
    value: {
      communicationInfo: {
        address: 'zzz',
        phone: ['xxx', 'yyy']
      }
    }
  }
}

describe('object pattern', () => {

  it('should merge actions everytime', async () => {
    const pattern = new ObjectPattern();
    pattern.addAction(action1);
    await wait(200);
    expect(pattern.getActions().length).toBe(1);
    pattern.addAction(action2);
    await wait(200);
    expect(pattern.getActions().length).toBe(1);
    pattern.addAction(action3);
    await wait(200);
    expect(pattern.getActions().length).toBe(1);
    expect(pattern.getActions()[0].payload.value).toEqual(value);
  });
});

function wait(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  })
}
