/**
 * @flow
 */

import Pattern from './pattern';

export default class MapPattern extends Pattern<UpdateObjectAction> {
  mergeMultiMapUpdate() {
    this.actions = [this.actions.reduce((result, action) => {
      result.payload.value = result.payload.value.mergeDeep(action.payload.value);
      return result;
    })];
  }

  mergeAction() {
    this.mergeMultiMapUpdate();
    return this.actions;
  }
}
