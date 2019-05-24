// @flow

import { throttle } from 'lodash';
import type { Pattern, Action, ObjectActionType } from '../types';

type ObjectAction = Action<ObjectActionType>;

export default class ObjectPattern implements Pattern<ObjectAction> {
  actions: Array<ObjectAction>;

  constructor() {
    this.actions = [];
  }

  mergeMultiMapUpdate() {
    this.actions = [this.actions.reduce((result: Object, action: ObjectAction) => {
      const newResult = { ...result };
      newResult.payload.value = { ...newResult.payload.value, ...action.payload.value };
      return newResult;
    })];
  }

  addAction = (action: ObjectAction) => {
    this.actions.push(action);
    this.mergeAction();
  }

  _mergeAction = (): Array<ObjectAction> => {
    this.mergeMultiMapUpdate();
    return this.actions;
  }

  mergeAction = throttle(this._mergeAction, 150);

  getActions = (): Array<ObjectAction> => this.actions
}
