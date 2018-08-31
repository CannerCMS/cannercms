// @flow

import type {CannerSchema} from '../flow-types';

export default class FilterModel {
  attributes: Object;
  constructor(attrs: CannerSchema, children: Array<CannerSchema>) {
    this.attributes = {
      ...attrs,
      type: 'filter'
    };
    this.attributes.filters = children;
  }

  toJson = (): Object => {
    return {
      ...this.attributes
    }
  }
}
