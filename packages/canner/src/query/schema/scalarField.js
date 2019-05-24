// @flow
import type { Field, Types } from './types';
import NullField from './nullField';

export default class ScalarField implements Field {
  type: Types;

  schema: any;

  key: string;

  constructor({ key, schema, type }: {key: string, schema: any, type: Types}) {
    this.key = key;
    this.schema = schema;
    this.type = type;
  }

  getKey() {
    return this.key;
  }

  getType() {
    return this.type;
  }

  exists() {
    return true;
  }

  getChild(fieldName: string) {
    return new NullField({ key: fieldName });
  }

  forEach() {

  }
}
