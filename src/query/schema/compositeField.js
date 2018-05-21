// @flow

import forEach from 'lodash/forEach';
import type {Field, Types} from './types';
import { createField } from './utils';
import NullField from './nullField';

export default class CompositeField implements Field {
  rootSchema: any;
  childFields: any;
  key: string;
  type: Types;

  constructor({type, rootSchema, childFields, key}: {type: Types, rootSchema: any, childFields: any, key: string}) {
    this.key = key;
    this.type = type;
    this.rootSchema = rootSchema;
    this.childFields = childFields;
  }

  getKey() {
    return this.key;
  }

  exists() {
    return true;
  }

  getType() {
    return this.type;
  }

  getChild(fieldName: string) {
    if (!this.childFields || !this.childFields[fieldName]) {
      return new NullField({key: fieldName});
    }

    const field = createField(fieldName, this.rootSchema, this.childFields[fieldName]);
    return field;
  }

  forEach(visitor: Function) {
    if (!this.childFields) {
      return;
    }

    forEach(this.childFields, (item, key) => {
      const field = createField(key, this.rootSchema, this.childFields[key]);
      visitor(field);
    });
  }
}
