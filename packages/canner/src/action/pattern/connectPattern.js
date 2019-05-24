// @flow

import { uniqBy } from 'lodash';
import type { Pattern, Action, ConnectActionType } from '../types';

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
    this.actions = uniqBy([...this.actions].reverse(), (action) => {
      const {
        key, id, path, value,
      } = action.payload;
      return `${key}.${(id: any)}.${(path: any)}.${value.id}`;
    }).reverse();
  }

  mergeAction = (): Array<ConnectAction> => {
    this.mergeConnectAndDisconnectAndDelete();
    return this.actions;
  }

  getActions = (): Array<ConnectAction> => this.actions
}
