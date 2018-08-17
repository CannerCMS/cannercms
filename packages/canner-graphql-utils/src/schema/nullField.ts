import { Field, Types } from './types';

export default class NullField implements Field {
  private key: string;

  constructor({key}: {key: string}) {
    this.key = key;
  }

  public getKey() {
    return this.key;
  }

  public exists() {
    return false;
  }

  public toJSON() {
    return {type: this.getType()};
  }

  public hasChild() {
    return false;
  }

  public getType() {
    return null;
  }

  public forEach() {
    return;
  }

  public getChild(fieldName: string) {
    return new NullField({key: fieldName});
  }
}
