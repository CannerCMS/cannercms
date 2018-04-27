// @flow

import type {Pattern, Action, ArrayActionType} from '../types';

type ArrayAction = Action<ArrayActionType>;

export class ObjectPattern implements Pattern<ArrayAction> {
  actions: Array<ArrayAction>;
  constructor() {
    this.actions = [];
  }



  addAction = (action: ArrayAction) => {
    this.actions.push(action);
  }

  mergeAction = (): Array<ArrayAction> => {
    return this.actions;
  }
}

function merger(oldVal, newVal) {
  return newVal;
}