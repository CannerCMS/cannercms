// @flow

import type {Pattern, Action, ObjectActionType} from '../types';
import {mergeWith} from 'immutable';

type ObjectAction = Action<ObjectActionType>;

export class ObjectPattern implements Pattern<ObjectAction> {
  actions: Array<ObjectAction>;
  constructor() {
    this.actions = [];
  }

  mergeMultiMapUpdate() {
    this.actions = [this.actions.reduce((result, action) => {
      result.payload.value = mergeWith(merger, result.payload.value, action.payload.value);
      return result;
    })];
  }

  addAction = (action: ObjectAction) => {
    this.actions.push(action);
  }

  mergeAction = (): Array<ObjectAction> => {
    this.mergeMultiMapUpdate();
    return this.actions;
  }
}

function merger(oldVal, newVal) {
  return newVal;
}