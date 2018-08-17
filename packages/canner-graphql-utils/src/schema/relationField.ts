import forEach from 'lodash/forEach';
import { Field, Types } from './types';
import { createField, capitalizeFirstLetter } from './utils';
import NullField from './nullField';
import * as pluralize from 'pluralize';

export default class RelationField implements Field {
  private schema: any;
  private key: string;
  private relationSchema: any;
  private rootSchema: any;

  constructor({rootSchema, schema, key}: {rootSchema: any, schema: any, key: string}) {
    this.key = key;
    this.schema = schema;
    this.rootSchema = rootSchema;
    this.relationSchema = rootSchema[this.schema.relation.to];
  }

  public exists() {
    return true;
  }

  public hasChild() {
    return true;
  }

  public getKey() {
    return this.key;
  }

  public getType() {
    return Types.RELATION;
  }

  public toJSON() {
    return {
      type: this.getType(),
      relationType: this.schema.relation.type,
      relationTo: this.relationTo()
    };
  }

  public isToOne() {
    return (this.schema.relation && this.schema.relation.type === 'toOne');
  }

  public isToMany() {
    return (this.schema.relation && this.schema.relation.type === 'toMany');
  }

  public relationTo() {
    return this.schema.relation.to;
  }

  public getTypename() {
    return capitalizeFirstLetter(pluralize.singular(this.relationTo()));
  }

  public getChild(fieldName: string) {
    if (!this.relationSchema ||
      !this.relationSchema.items ||
      !this.relationSchema.items.items ||
      !this.relationSchema.items.items[fieldName]
    ) {
      return new NullField({key: fieldName});
    }

    const field = createField(fieldName, this.rootSchema, this.relationSchema.items.items[fieldName]);
    return field;
  }

  public forEach(visitor) {
    if (!this.relationSchema ||
      !this.relationSchema.items ||
      !this.relationSchema.items.items
    ) {
      return;
    }

    forEach(this.relationSchema.items.items, (item, key) => {
      const field = createField(key, this.rootSchema, this.relationSchema.items.items[key]);
      visitor(field);
    });
  }
}
