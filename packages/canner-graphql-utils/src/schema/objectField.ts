import forEach from 'lodash/forEach';
import isEmpty from 'lodash/isEmpty';
import { Field, Types } from './types';
import { createField } from './utils';
import NullField from './nullField';

export default class ObjectField implements Field {
  private schema: any;
  private rootSchema: any;
  private key: string;

  constructor({rootSchema, schema, key}: {rootSchema: any, schema: any, key: string}) {
    this.key = key;
    this.rootSchema = rootSchema;
    this.schema = schema;
  }

  public getKey() {
    return this.key;
  }

  public hasChild() {
    return true;
  }

  public toJSON() {
    return {type: this.getType()};
  }

  public exists() {
    return true;
  }

  public getType() {
    return Types.OBJECT;
  }

  public getChild(fieldName: string) {
    if (!this.schema.items || !this.schema.items[fieldName]) {
      return new NullField({key: fieldName});
    }

    const field = createField(fieldName, this.rootSchema, this.schema.items[fieldName]);
    return field;
  }

  public forEach(visitor) {
    if (!this.schema ||
      !this.schema.items
    ) {
      return;
    }

    forEach(this.schema.items, (item, key) => {
      const field = createField(key, this.rootSchema, this.schema.items[key]);
      visitor(field);
    });
  }
}
