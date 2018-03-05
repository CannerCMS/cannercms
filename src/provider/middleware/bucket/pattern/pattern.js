/**
 * @flow
 */

export default class Pattern {
  actions: Array<MutateAction>
  name: string

  constructor(actionName: string) {
    this.actions = [];
    this.name = actionName;
  }

  addAction(action: MutateAction) {
    this.actions.push(action);
  }

  mergeAction(): Array<MutateAction> {
    return this.actions;
  }
}
