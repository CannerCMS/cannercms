// @flow

import type {CannerSchema} from '../flow-types';

export default class PageModel {
  items: CannerSchema | {[string]: CannerSchema};
  keyName: string;

  constructor({ keyName }: string, children: Array<CannerSchema>) {
    this.keyName = keyName;

    if (children && children.length) {
      this.items = children.reduce((result, child) => {
        if (child.keyName in result) {
          throw new Error(`duplicated name in children of ${this.keyName}`);
        }
        result[child.keyName] = child;
        return result;
      }, {});
    }
  }

  toJson() {
    return {
      keyName: this.keyName,
      type: 'page',
      items: this.items
    };
  }
}