/**
 * @flow
 */

export default class Pattern<T> {
  actions: Array<T>
  name: string

  constructor(actionName: string) {
    this.actions = [];
    this.name = actionName;
  }

  addAction(action: T) {
    this.actions.push(action);
  }

  mergeAction(): Array<T> {
    return this.actions;
  }
}
