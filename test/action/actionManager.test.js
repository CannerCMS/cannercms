import {ActionManager} from '../../src/action';
import {
  ArrayPattern,
  ObjectPattern,
  ConnectPattern
} from '../../src/action/pattern';

const objectAction = {
  type: 'UPDATE_OBJECT',
  payload: {
    key: 'user'
  }
}

const updateArrayAction = {
  type: 'UPDATE_ARRAY',
  payload: {
    key: 'posts',
    id: 'id1'
  }
}

const createArrayAction = {
  type: 'CREATE_ARRAY',
  payload: {
    key: 'posts',
    id: 'id1'
  }
}

const deleteArrayAction = {
  type: 'DELETE_ARRAY',
  payload: {
    key: 'posts',
    id: 'id1'
  }
}

describe('add action', () => {
  let actionManager;
  beforeEach(() => {
    actionManager = new ActionManager();
  });

  it('add object action', () => {
    actionManager.addAction(objectAction);
    expect(actionManager.store.user).toBeInstanceOf(ObjectPattern);
  });

  it('add array action', () => {
    actionManager.addAction(createArrayAction);
    expect(actionManager.store.posts[0].id).toEqual('id1');
    expect(actionManager.store.posts[0].array).toBeInstanceOf(ArrayPattern);
    expect(actionManager.store.posts[0].connect).toEqual(ConnectPattern);
  });

})
