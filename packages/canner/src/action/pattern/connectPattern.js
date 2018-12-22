// @flow

import type {Pattern, Action, ConnectActionType} from '../types';
import {uniqBy} from 'lodash';

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
    this.actions = uniqBy([...this.actions].reverse(), action => {
      const {key, id, path} = action.payload;
      return `${key}.${id}.${path}`;
    });
  }

  mergeAction = (): Array<ConnectAction> => {
    this.mergeConnectAndDisconnectAndDelete();
    return this.actions;
  }

  getActions = (): Array<ConnectAction> => {
    return this.actions;
  }
}
