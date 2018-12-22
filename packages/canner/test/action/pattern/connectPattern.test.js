import ConnectPattern from '../../../src/action/pattern/connectPattern';

const connectAction1 = {
  type: 'CONNECT',
  payload: {
    key: 'array',
    id: 'id1',
    path: 'category',
    value: {
      id: 1
    }
  }
}

const connectAction2 = {
  type: 'CONNECT',
  payload: {
    key: 'array',
    id: 'id1',
    path: 'category',
    value: {
      id: 2
    }
  }
}

const disconnectAction1 = {
  type: 'DISCONNECT',
  payload: {
    key: 'array',
    id: 'id1',
    path: 'category',
    value: {
      id: 1
    }
  }
}

const disconnectAction2 = {
  type: 'DISCONNECT',
  payload: {
    key: 'array',
    id: 'id1',
    path: 'category',
    value: {
      id: 2
    }
  }
}

const createAndConnectAction = {
  type: 'CREATE_AND_CONNECT',
  payload: {
    key: 'array',
    id: 'random1',
    path: 'category',
    value: {
      title: 'title'
    }
  }
}

const disconnectAndDeleteAction1 = {
  type: 'DISCONNECT_AND_DELET',
  payload: {
    key: 'array',
    id: 'random2',
    path: 'category',
    value: {
      id: 1
    }
  }
}

describe('connect pattern', () => {
  let connectPattern;
  
  beforeEach(() => {
    connectPattern = new ConnectPattern();
  });

  it('merge connect and disconnect', () => {
    // for now, connect pattern doesn't merge
    connectPattern.addAction(connectAction1);
    connectPattern.addAction(disconnectAction1);
    connectPattern.addAction(connectAction1);
    connectPattern.addAction(disconnectAction1);
    connectPattern.addAction(connectAction1);
    connectPattern.addAction(disconnectAction1);
    expect(connectPattern.getActions().length).toBe(1);
    expect(connectPattern.getActions()[0]).toEqual(disconnectAction1);
  });

  it('do not merge different id', () => {
    // for now, connect pattern doesn't merge
    connectPattern.addAction(connectAction1);
    connectPattern.addAction(disconnectAction1);
    connectPattern.addAction(connectAction2);
    connectPattern.addAction(disconnectAction2);
    connectPattern.addAction(connectAction1);
    connectPattern.addAction(disconnectAction1);

    expect(connectPattern.getActions().length).toBe(2);
    expect(connectPattern.getActions()[0]).toEqual(disconnectAction1);
    expect(connectPattern.getActions()[1]).toEqual(disconnectAction2);
  });
});

