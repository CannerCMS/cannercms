// @flow

import type {CannerSchema} from '../flow-types';

export default class PageModel {
  items: CannerSchema | {[string]: CannerSchema};
  keyName: string;
  title: string;

  constructor({ keyName, title }: {keyName: string, title: string}, children: Array<CannerSchema>) {
    if (!keyName) {
      throw new Error('The keyName of <page /> is required');
    }
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
    this.title = title;
  }

  toJson() {
    return {
      keyName: this.keyName,
      type: 'page',
      items: this.items,
      title: this.title
    };
  }
}