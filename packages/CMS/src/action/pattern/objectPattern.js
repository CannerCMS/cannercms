// @flow

import type {Pattern, Action, ObjectActionType} from '../types';

type ObjectAction = Action<ObjectActionType>;

export default class ObjectPattern implements Pattern<ObjectAction> {
  actions: Array<ObjectAction>;
  constructor() {
    this.actions = [];
  }

  mergeMultiMapUpdate() {
    this.actions = [this.actions.reduce((result, action) => {
      result.payload.value = result.payload.value.merge(action.payload.value);
      return result;
    })];
  }

  addAction = (action: ObjectAction) => {
    this.actions.push(action);
    this.mergeAction();
  }

  mergeAction = (): Array<ObjectAction> => {
    this.mergeMultiMapUpdate();
    return this.actions;
  }

  getActions = (): Array<ObjectAction> => {
    return this.actions;
  }
}
