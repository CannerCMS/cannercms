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
    
  }

  mergeAction = (): Array<ConnectAction> => {
    this.mergeConnectAndDisconnectAndDelete();
    return this.actions;
  }

  getActions = (): Array<ConnectAction> => {
    return this.actions;
  }
}
