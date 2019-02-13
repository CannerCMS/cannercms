// @flow

import type {Pattern, Action, ObjectActionType} from '../types';
import {throttle} from 'lodash';

type ObjectAction = Action<ObjectActionType>;

export default class ObjectPattern implements Pattern<ObjectAction> {
  actions: Array<ObjectAction>;
  constructor() {
    this.actions = [];
  }

  mergeMultiMapUpdate() {
    this.actions = [this.actions.reduce((result: Object, action: ObjectAction) => {
      result.payload.value = {...result.payload.value, ...action.payload.value};
      return result;
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

  getActions = (): Array<ObjectAction> => {
    return this.actions;
  }
}
