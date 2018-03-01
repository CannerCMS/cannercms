/**
 * @flow
 */

import Pattern from './pattern';

export default class MapPattern extends Pattern {
  mergeMultiMapUpdate() {
    this.actions = [this.actions[this.actions.length - 1]];
  }

  mergeAction() {
    this.mergeMultiMapUpdate();
    return this.actions;
  }
}
