import { Connector, Pagination } from './types';
import isEmpty from 'lodash/isEmpty';
import _last from 'lodash/last';
import mapValues from 'lodash/mapValues';
import Memory from 'lowdb/adapters/Memory';
import low from 'lowdb';
import uuid from 'uuid/v4';
import { paginator, filter } from 'canner-graphql-utils';
import { Field, Types } from 'canner-graphql-utils/lib/schema/types';

const recursivePayload = ({data, schema}: {data: any, schema: Field}) => {
  return mapValues(data, (val, key) => {
    const field = schema.getChild(key);
    const type = field.getType();
    if (type === Types.ARRAY) {
      if (isEmpty(val) || isEmpty(val.set)) {
        return [];
      }

      return val.set;
    }

    return val;
  });
};

export default class MemoryConnector implements Connector {
  private db: any;
  constructor({defaultData}: {defaultData?: any}) {
    const adapter = new Memory();
    this.db = low(adapter);
    if (defaultData) {
      this.db.defaults(defaultData).write();
    }
  }

  public async listResolveByUnique(
    { key, field, schema }: { key: string; field: { [key: string]: any; }; schema: Field }): Promise<any> {
    this.setDefault(key, schema);
    return this.db.get(key).find(field).value();
  }

  public async listResolveQuery(
    {key, where, order, pagination, schema}:
    {key: string, where: any, order: any; pagination: Pagination; schema: Field}): Promise<any> {
    this.setDefault(key, schema);

    let rows = this.db.get(key).value();
    if (!isEmpty(where)) {
      // if relation filter exist, then join data
      Object.keys(where).forEach(field => {
        if (where[field].schema
            && where[field].schema.getType() === Types.RELATION
            && where[field].schema.isToOne()
          ) {
          const to = where[field].schema.relationTo();
          const joinData = this.db.get(to);
          rows = rows.map(row => {
            return {
              ...row,
              [field]: joinData.find({id: row[field]}).value()
            };
          });
        }
      });
    }
    rows = filter({data: rows, where, order});
    const result = await paginator(rows, pagination);
    return result;
  }

  public async hasNextPage() {
    return;
  }

  public async resolveToOne({ from, to, id, schema }:
    { from: string, to: string, id: string, schema: Field }): Promise<any> {
    if (!id) {
      return null;
    }
    this.setDefault(to, schema);
    return this.db.get(to).find({id}).value();
  }

  public async resolveToMany(
    { from, to, ids, pagination, schema }:
    { from: string, to: string, ids: [string], pagination: Pagination, schema: Field}): Promise<any> {
    if (!ids) {
      return {
        edges: [],
        pageInfo: {
          hasNextPage: false
        }
      };
    }
    this.setDefault(to, schema);
    const rows = this.db.get(to).filter(data => ids.indexOf(data.id) >= 0).value();
    return paginator(rows, pagination);
  }

  public async mapResolve(key: string, schema: Field) {
    this.setDefault(key, schema);
    return this.db.get(key).value();
  }

  public mapUpdate(key: string, payload: any, schema: Field): Promise<any> {
    this.setDefault(key, schema);
    payload = recursivePayload({data: payload, schema});
    return this.db.get(key).assign(payload).write();
  }

  public async listCreate(key: string, payload: any, schema: Field): Promise<any> {
    this.setDefault(key, schema);
    payload = recursivePayload({data: payload, schema});
    const id = uuid();
    return _last(this.db.get(key).push({
      id,
      ...payload
    }).write());
  }

  public async listUpdate(key: string, where: any, payload: any, schema: Field): Promise<any> {
    this.setDefault(key, schema);
    payload = recursivePayload({data: payload, schema});
    return this.db.get(key).find(where).assign(payload).write();
  }

  public async listDelete(key: string, where: any, schema: Field): Promise<any> {
    this.setDefault(key, schema);
    this.db.get(key).remove(where).write();
    return where;
  }

  private setDefault(key: string, schema: Field) {
    if (this.db.has(key)) {
      return;
    }

    if (schema.getType() === Types.ARRAY) {
      this.db.set(key, []);
    } else {
      this.db.set(key, {});
    }
  }
}
