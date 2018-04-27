// @flow

import type {Pattern, Action, ConnectActionType} from '../types';

type ConnectAction = Action<ConnectActionType>;

export default class ConnectPattern implements Pattern<ConnectAction> {
  actions: Array<ConnectAction>;

  constructor() {
    this.actions = [];
  }

  addAction = (action: ConnectAction) => {
    this.actions.push(action);
    this.mergeAction();
  }

  mergeConnectAndDisconnectAndDelete = () => {
    let ids = [];
    this.actions = this.actions.reverse()
      .filter(action => {
        if (action.type === 'CREATE_AND_CONNECT') {
          return true;
        }
        const id = action.payload.value.id;
        if (ids.indexOf(id) === -1) {
          ids.push(id);
          return true;
        } else {
          return false;
        }
      })
      .reverse();
  }

  mergeAction = (): Array<ConnectAction> => {
    this.mergeConnectAndDisconnectAndDelete();
    return this.actions;
  }

  getActions = (): Array<ConnectAction> => {
    return this.actions;
  }
}
