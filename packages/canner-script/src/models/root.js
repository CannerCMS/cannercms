// @flow

import type {CannerSchema} from '../flow-types';

export default class RootModel {
  items: CannerSchema | {[string]: CannerSchema};
  keyName: string;

  constructor(attrs: CannerSchema, children: Array<CannerSchema>) {
    if (children && children.length) {
      this.items = children.reduce((result, child) => {
        if (child.keyName in result) {
          throw new Error(`duplicated name in children of ${this.keyName}`);
        }

        if (child.type === 'array' && !child.toolbar) {
          child.toolbar = {
            pagination: {}
          }
        }

        delete child.endpoint;

        result[child.keyName] = child;
        return result;
      }, {});
    }
  }

  toJson() {
    return this.items;
  }
}