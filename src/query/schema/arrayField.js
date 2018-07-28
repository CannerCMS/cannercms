// @flow

import forEach from 'lodash/forEach';
import {createField, isCompositeType} from './utils';
import {types} from './types';
import NullField from './nullField';

import type {Field} from './types';


export default class ArrayField implements Field {
  schema: any;
  rootSchema: any;
  key: string;
  isEntity: boolean;

  constructor({rootSchema, schema, key, isEntity}: {rootSchema: any, schema: any, key: string, isEntity?: ?boolean}) {
    this.key = key;
    this.rootSchema = rootSchema;
    this.schema = schema;
    this.isEntity = isEntity || false;
  }

  getAttr(name: string) {
    return this.schema[name];
  }

  getKey() {
    return this.key;
  }

  getType() {
    return types.ARRAY;
  }

  exists() {
    return true;
  }

  getChild(fieldName: string) {
    if (isCompositeType(this.schema.items.type)) {
      const child = createField(fieldName, this.rootSchema, this.schema.items);
      const childField = child.getChild(fieldName);
      return childField;
    }

    if (!this.schema.items || !this.schema.items.items || !this.schema.items.items[fieldName]) {
      return new NullField({key: fieldName});
    }

    // array of object
    const field = createField(fieldName, this.rootSchema, this.schema.items.items[fieldName]);
    return field;
  }

  forEach(visitor: Function) {
    if (!this.schema ||
      !this.schema.items ||
      !this.schema.items.items
    ) {
      return;
    }

    forEach(this.schema.items.items, (item, key) => {
      const field = createField(key, this.rootSchema, this.schema.items.items[key]);
      visitor(field);
    });
  }
}
