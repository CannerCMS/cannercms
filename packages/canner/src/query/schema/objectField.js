// @flow
/* eslint import/no-cycle: 0 */
import forEach from 'lodash/forEach';
import { createField } from './utils';
import NullField from './nullField';
import { types } from './types';

import type { Field } from './types';

export default class ObjectField implements Field {
  schema: any;

  rootSchema: any;

  key: string;

  isEntity: boolean;

  constructor({
    rootSchema, schema, key, isEntity,
  }: {rootSchema: any, schema: any, key: string, isEntity?: ?boolean}) {
    this.key = key;
    this.rootSchema = rootSchema;
    this.schema = schema;
    this.isEntity = isEntity || false;
  }

  getKey() {
    return this.key;
  }

  exists() {
    return true;
  }

  getType() {
    return types.OBJECT;
  }

  getChild(fieldName: string) {
    if (!this.schema.items || !this.schema.items[fieldName]) {
      return new NullField({ key: fieldName });
    }

    const field = createField(fieldName, this.rootSchema, this.schema.items[fieldName]);
    return field;
  }

  forEach(visitor: Function) {
    if (!this.schema
      || !this.schema.items
    ) {
      return;
    }

    forEach(this.schema.items, (item, key) => {
      const field = createField(key, this.rootSchema, this.schema.items[key]);
      visitor(field);
    });
  }
}
