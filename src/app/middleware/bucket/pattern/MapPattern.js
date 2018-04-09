/**
 * @flow
 */

import Pattern from './pattern';
import {mergeWith} from 'immutable';

export default class MapPattern extends Pattern<UpdateObjectAction> {
  mergeMultiMapUpdate() {
    this.actions = [this.actions.reduce((result, action) => {
      result.payload.value = mergeWith(merger, result.payload.value, action.payload.value);
      return result;
    })];
  }

  mergeAction() {
    this.mergeMultiMapUpdate();
    return this.actions;
  }
}

function merger(oldVal, newVal) {
  return newVal;
}