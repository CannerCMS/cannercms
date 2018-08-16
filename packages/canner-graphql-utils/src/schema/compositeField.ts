import forEach from 'lodash/forEach';
import isEmpty from 'lodash/isEmpty';
import { Field, Types } from './types';
import { createField } from './utils';
import NullField from './nullField';

export default class CompositeField implements Field {
  private rootSchema: any;
  private childFields: any;
  private key: string;
  private type: Types;

  constructor({type, rootSchema, childFields, key}: {type: Types, rootSchema: any, childFields: any, key: string}) {
    this.key = key;
    this.type = type;
    this.rootSchema = rootSchema;
    this.childFields = childFields;
  }

  public getKey() {
    return this.key;
  }

  public toJSON() {
    return {type: this.getType()};
  }

  public hasChild() {
    return true;
  }

  public exists() {
    return true;
  }

  public getType() {
    return this.type;
  }

  public getChild(fieldName: string) {
    if (!this.childFields || !this.childFields[fieldName]) {
      return new NullField({key: fieldName});
    }

    const field = createField(fieldName, this.rootSchema, this.childFields[fieldName]);
    return field;
  }

  public forEach(visitor) {
    if (!this.childFields) {
      return;
    }

    forEach(this.childFields, (item, key) => {
      const field = createField(key, this.rootSchema, this.childFields[key]);
      visitor(field);
    });
  }
}
