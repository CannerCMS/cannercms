import ConnectPattern from '../../../src/action/pattern/connectPattern';

const connectAction1 = {
  type: 'CONNECT',
  payload: {
    value: {
      id: 1
    }
  }
}

const connectAction2 = {
  type: 'CONNECT',
  payload: {
    value: {
      id: 2
    }
  }
}

const disconnectAction1 = {
  type: 'DISCONNECT',
  payload: {
    value: {
      id: 1
    }
  }
}

const disconnectAction2 = {
  type: 'DISCONNECT',
  payload: {
    value: {
      id: 2
    }
  }
}

const createAndConnectAction = {
  type: 'CREATE_AND_CONNECT',
  payload: {
    value: {
      title: 'title'
    }
  }
}

const disconnectAndDeleteAction1 = {
  type: 'DISCONNECT_AND_DELET',
  payload: {
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
    connectPattern.addAction(connectAction1);
    connectPattern.addAction(connectAction2);
    connectPattern.addAction(createAndConnectAction);
    connectPattern.addAction(disconnectAction2);
    connectPattern.addAction(connectAction1);
    connectPattern.addAction(disconnectAction1);
    connectPattern.addAction(disconnectAndDeleteAction1);
    expect(connectPattern.getActions().length).toBe(3);
    expect(connectPattern.getActions()[0]).toEqual(createAndConnectAction);
    expect(connectPattern.getActions()[1]).toEqual(disconnectAction2);
    expect(connectPattern.getActions()[2]).toEqual(disconnectAndDeleteAction1);
  });
});

