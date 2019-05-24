// @flow

import { throttle } from 'lodash';
import type { Pattern, Action, ArrayActionType } from '../types';

type ArrayAction = Action<ArrayActionType>;

export default class ArrayPattern implements Pattern<ArrayAction> {
  actions: Array<ArrayAction>;

  constructor() {
    this.actions = [];
  }

  removeAllActionIfDeleteAfterCreate = () => {
    if (this.actions.length >= 2
      && this.actions[0].type === 'CREATE_ARRAY'
      && this.actions.slice(-1)[0].type === 'DELETE_ARRAY'
    ) {
      this.actions = [];
    }
  }

  removeAllUpdateBeforeDelete = () => {
    if (this.actions.length >= 2
      && this.actions[0].type !== 'CREATE_ARRAY'
      && this.actions.slice(-1)[0].type === 'DELETE_ARRAY'
    ) {
      this.actions = this.actions.slice(-1);
    }
  }

  mergeAllUpdate = () => {
    if (this.actions.length >= 2
      && this.actions[0].type === 'UPDATE_ARRAY'
      && this.actions.slice(-1)[0].type === 'UPDATE_ARRAY'
    ) {
      this.actions = [this.actions.reduce((result: Object, action: ArrayAction) => {
        const newResult = { ...result };
        newResult.payload.value = { ...newResult.payload.value, ...action.payload.value };
        return newResult;
      })];
    }
  }

  mergeUpdateAndCreate = () => {
    if (this.actions.length >= 2
      && this.actions[0].type === 'CREATE_ARRAY'
      && this.actions.slice(-1)[0].type === 'UPDATE_ARRAY'
    ) {
      this.actions = [this.actions.reduce((result: Object, action: ArrayAction) => {
        const newResult = { ...result };
        newResult.payload.value = { ...newResult.payload.value, ...action.payload.value };
        return newResult;
      })];
    }
  }

  addAction = (action: ArrayAction) => {
    this.actions.push(action);
    this.mergeAction();
  }

  _mergeAction = (): Array<ArrayAction> => {
    this.removeAllActionIfDeleteAfterCreate();
    this.removeAllUpdateBeforeDelete();
    this.mergeAllUpdate();
    this.mergeUpdateAndCreate();
    return this.actions;
  }

  mergeAction = throttle(this._mergeAction, 150);

  getActions = (): Array<ArrayAction> => this.actions
}
