// @flow

import typeimport { List } from "antd";
 {Pattern, Action, ArrayActionType} from '../types';

type ArrayAction = Action<ArrayActionType>;

export class ObjectPattern implements Pattern<ArrayAction> {
  actions: Array<ArrayAction>;

  constructor() {
    this.actions = [];
  }

  removeAllActionIfDeleteAfterAction = () => {
    if (this.actions[0].type === 'CREATE_ARRAY' && 
      this.actions.slice(-1)[0].type === 'DELETE_ARRAY'
    ) {
      this.actions = [];
    }
  }

  removeAllUpdateBeforeDelete = () => {
    if (this.actions[0].type !== 'CREATE_ARRAY' &&
      this.actions.slice(-1)[0].type === 'DELETE_ARRAY'
    ) {
      this.actions = this.actions.slice(-1);
    }
  }

  mergeAllUpdate = () => {
    if (this.actions[0].type === 'UPDATE_ARRAY' && 
      this.actions.slice(-1)[0].type === 'UPDATE_ARRAY'
    ) {
      this.actions = this.actions.reduce((result, action) => {
        result.payload.value = result.payload.value.merge(action.payload.value);
        return result;
      }, new List())
    }
  }

  mergeUpdateAndCreate = () => {

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