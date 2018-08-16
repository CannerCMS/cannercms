import { Connector } from '../types';
import { Field } from '../schema/types';
import { MutationField } from './field';
import get from 'lodash/get';

export interface ToOneMutationPayload {
  create?: {
    [key: string]: any
  };
  connect?: {
    [key: string]: any
  };
  disconnect?: {
    [key: string]: any
  };
  delete?: {
    [key: string]: any
  };
}

export default class ToOneField implements MutationField<string> {
  private payload: ToOneMutationPayload;
  private key: string;
  private itemSchema: any;
  private id: string;
  private collection: string;
  private rootSchema: Field;

  constructor({
    rootSchema, key, collection, itemSchema, payload
  }: {rootSchema: Field, key: string, collection: string, itemSchema: any, payload: ToOneMutationPayload}) {
    this.key = key;
    this.collection = collection;
    this.itemSchema = itemSchema;
    this.rootSchema = rootSchema;
    this.payload = payload;
  }

  public async preResolveCreate(connector: Connector) {
    const to = this.itemSchema.relationTo();
    if (this.payload.create) {
      const created = await connector.listCreate(to, this.payload.create, this.itemSchema);
      this.id = created.id;
    } else {
      this.id = this.payload.connect.id;
    }
  }

  public async preResolveUpdate(rowId: string, connector: Connector) {
    const to = this.itemSchema.relationTo();
    if (this.payload.create) {
      const created = await connector.listCreate(to, this.payload.create, this.itemSchema);
      this.id = created.id;
    } else if (this.payload.connect) {
      this.id = this.payload.connect.id;
    } else if (this.payload.disconnect) {
      this.id = null;
    } else if (this.payload.delete) {
      const data = await connector.listResolveByUnique({
        key: this.collection, field: {id: rowId}, schema: this.rootSchema});
      const delId = data && data[this.key] || null;
      // if delId exist, delete it from database
      if (delId) {
        await connector.listDelete(to, {id: delId}, this.itemSchema);
      }
      this.id = null;
    }
  }

  public async preResolveMapUpdate(connector: Connector) {
    const to = this.itemSchema.relationTo();
    if (this.payload.create) {
      const created = await connector.listCreate(to, this.payload.create, this.itemSchema);
      this.id = created.id;
    } else if (this.payload.connect) {
      this.id = this.payload.connect.id;
    } else if (this.payload.disconnect) {
      this.id = null;
    } else if (this.payload.delete) {
      const data = await connector.mapResolve(this.collection, this.rootSchema);
      const delId = get(data, this.key) || null;
      if (delId) {
        await connector.listDelete(to, {id: delId}, this.itemSchema);
      }
      this.id = null;
    }
  }

  public async preResolveDelete(rowId: string, connector: Connector) {
    const to = this.itemSchema.relationTo();
    if (this.payload.delete) {
      const data = await connector.listResolveByUnique({
        key: this.collection, field: {id: rowId}, schema: this.rootSchema});
      const delId = data && data[this.key] || null;
      if (delId) {
        await connector.listDelete(to, {id: delId}, this.itemSchema);
      }
    }
    this.id = null;
  }

  public resolve() {
    return this.id;
  }
}
