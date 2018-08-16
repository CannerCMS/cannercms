import forEach from 'lodash/forEach';
import { Field, Types } from './types';
import { createField, isCompositeType } from './utils';
import NullField from './nullField';

export default class ArrayField implements Field {
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

  public getType() {
    return Types.ARRAY;
  }

  public toJSON() {
    return {type: this.getType()};
  }

  public hasChild() {
    return Boolean(
      isCompositeType(this.schema.items.type) ||
      (this.schema.items && this.schema.items.items)
    );
  }

  public exists() {
    return true;
  }

  public getChild(fieldName: string) {
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

  public forEach(visitor) {
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
