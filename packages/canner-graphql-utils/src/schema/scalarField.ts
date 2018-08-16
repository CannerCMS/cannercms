import { Field, Types } from './types';
import NullField from './nullField';

export default class ScalarField implements Field {
  private type: Types;
  private schema: any;
  private key: string;

  constructor({key, schema, type}: {key: string, schema: any, type: Types}) {
    this.key = key;
    this.schema = schema;
    this.type = type;
  }

  public getKey() {
    return this.key;
  }

  public toJSON() {
    return {type: this.getType()};
  }

  public hasChild() {
    return false;
  }

  public getType() {
    return this.type;
  }

  public exists() {
    return true;
  }

  public getChild(fieldName: string) {
    return new NullField({key: fieldName});
  }

  public forEach() {
    return;
  }
}
