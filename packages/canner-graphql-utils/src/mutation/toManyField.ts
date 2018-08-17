import { Connector } from '../types';
import { MutationField } from './field';
import reject from 'lodash/reject';
import get from 'lodash/get';
import { Field } from '../schema/types';

export interface ToManyMutationPayload {
  create?: Array<{
    [key: string]: any
  }>;
  connect?: Array<{
    [key: string]: any
  }>;
  disconnect?: Array<{
    [key: string]: any
  }>;
  delete?: Array<{
    [key: string]: any
  }>;
}

export default class ToManyField implements MutationField<string[]> {
  private payload: ToManyMutationPayload;
  private collection: string;
  private key: string;
  private itemSchema: any;
  private rootSchema: Field;
  private ids: string[];

  constructor({
    rootSchema, key, collection, itemSchema, payload
  }: {rootSchema: Field, key: string, collection: string, itemSchema: any, payload: ToManyMutationPayload}) {
    this.key = key;
    this.collection = collection;
    this.itemSchema = itemSchema;
    this.rootSchema = rootSchema;
    this.payload = payload;
  }

  public async preResolveCreate(connector: Connector) {
    const to = this.itemSchema.relationTo();
    this.ids = [];
    if (this.payload.create) {
      const created = await Promise.all(this.payload.create.map(payload => {
        return connector.listCreate(to, payload, this.itemSchema);
      }));
      this.ids.push(...created.map(row => row.id));
    }

    if (this.payload.connect) {
      this.ids.push(...this.payload.connect.map(payload => payload.id));
    }
  }

  public async preResolveUpdate(rowId: string, connector: Connector) {
    const to = this.itemSchema.relationTo();
    const data = await connector.listResolveByUnique({
      key: this.collection, field: {id: rowId}, schema: this.rootSchema});
    let ids = data && data[this.key] || [];
    if (this.payload.create) {
      const created = await Promise.all(this.payload.create.map(payload => {
        return connector.listCreate(to, payload, this.itemSchema);
      }));
      ids.push(...created.map(row => row.id));
    }

    if (this.payload.connect) {
      ids.push(...this.payload.connect.map(payload => payload.id));
    }

    if (this.payload.disconnect) {
      this.payload.disconnect.forEach(payload => {
        ids = reject(ids, id => id === payload.id);
      });
    }

    if (this.payload.delete) {
      await Promise.all(this.payload.delete.map(payload => {
        return connector.listDelete(this.key, {id: payload.id}, this.itemSchema);
      }));
      this.payload.delete.forEach(payload => {
        ids = reject(ids, id => id === payload.id);
      });
    }

    this.ids = ids;
  }

  public async preResolveMapUpdate(connector: Connector) {
    const to = this.itemSchema.relationTo();
    const data = await connector.mapResolve(this.collection, this.rootSchema);
    let ids = get(data, this.key) || [];
    if (this.payload.create) {
      const created = await Promise.all(this.payload.create.map(payload => {
        return connector.listCreate(to, payload, this.itemSchema);
      }));
      ids.push(...created.map(row => row.id));
    }

    if (this.payload.connect) {
      ids.push(...this.payload.connect.map(payload => payload.id));
    }

    if (this.payload.disconnect) {
      this.payload.disconnect.forEach(payload => {
        ids = reject(ids, id => id === payload.id);
      });
    }

    if (this.payload.delete) {
      await Promise.all(this.payload.delete.map(payload => {
        return connector.listDelete(this.key, {id: payload.id}, this.itemSchema);
      }));
      this.payload.delete.forEach(payload => {
        ids = reject(ids, id => id === payload.id);
      });
    }

    this.ids = ids;
  }

  public async preResolveDelete(rowId: string, connector: Connector) {
    const to = this.itemSchema.relationTo();

    if (this.payload.delete) {
      const data = await connector.listResolveByUnique({key: to, field: {id: rowId}, schema: this.itemSchema});
      const ids = data[this.key];
      await Promise.all(ids.map(id => {
        return connector.listDelete(this.key, {id}, this.itemSchema);
      }));
    }
    this.ids = null;
  }

  public resolve() {
    return this.ids;
  }
}
