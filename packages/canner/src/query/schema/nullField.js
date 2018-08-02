// @flow

import type {Field} from './types';
import {types} from './types';

export default class NullField implements Field {
  key: string;

  constructor({key}: {key: string}) {
    this.key = key;
  }

  getKey() {
    return this.key;
  }

  exists() {
    return false;
  }

  getType() {
    return types.NULL;
  }

  forEach() {
    return;
  }

  getChild(fieldName: string) {
    return new NullField({key: fieldName});
  }
}
