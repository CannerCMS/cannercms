import { Connector, Pagination } from './types';
import { Field } from 'canner-graphql-utils/lib/schema/types';
import fetch from 'isomorphic-fetch';
import { getConfig } from '../config';
const {baseUrl} = getConfig();

enum Action {
  listUnique = 'LIST_UNIQUE',
  list = 'LIST',
  toOne = 'TO_ONE',
  toMany = 'TO_MANY',
  mapQuery = 'MAP_QUERY',
  mapUpdate = 'MAP_UPDATE',
  listCreate = 'LIST_CREATE',
  listUpdate = 'LIST_UPDATE',
  listDelete = 'LIST_DELETE'
}

const endpointTargetUrl = `${baseUrl}/connector`;

export default class CannerPlatformConnector implements Connector {
  public isPlatform: boolean = true;
  protected service: string;
  protected resourceId: string;
  protected connectorName: string;
  protected connectorParams: any;
  private secret: string;
  private env: string;
  private appId: string;
  private rootSchema: any;

  public async prepare({secret, appId, env, schema}: {secret: string, appId: string, env: string, schema: any}) {
    this.appId = appId;
    this.secret = secret;
    this.env = env;
    this.rootSchema = schema;
  }

  public async listResolveByUnique(
    { key, field, schema }: { key: string; field: { [key: string]: any; }; schema: Field }): Promise<any> {
      return this.request({
        key,
        type: Action.listUnique,
        payload: {
          field
        }
      });
  }

  public async listResolveQuery(
    {key, where, order, pagination, schema}:
    {key: string, where: any, order: any; pagination: Pagination; schema: Field}): Promise<any> {
      return this.request({
        key,
        type: Action.list,
        payload: {
          where,
          order,
          pagination
        }
      });
  }

  public async hasNextPage() {
    return;
  }

  public async resolveToOne({ from, to, id, schema }:
    { from: string, to: string, id: string, schema: Field }): Promise<any> {
    return this.request({
      key: to,
      type: Action.toOne,
      payload: {
        from,
        to,
        id
      }
    });
  }

  public async resolveToMany(
    { from, to, ids, pagination, schema }:
    { from: string, to: string, ids: [string], pagination: Pagination, schema: Field}): Promise<any> {
      return this.request({
        key: to,
        type: Action.toMany,
        payload: {
          from,
          to,
          ids,
          pagination
        }
      });
  }

  public async mapResolve(key: string, schema: Field) {
    return this.request({
      key,
      type: Action.mapQuery
    });
  }

  public mapUpdate(key: string, payload: any, schema: Field): Promise<any> {
    return this.request({
      key,
      type: Action.mapUpdate,
      payload: {payload}
    });
  }

  public async listCreate(key: string, payload: any, schema: Field): Promise<any> {
    return this.request({
      key,
      type: Action.listCreate,
      payload: {payload}
    });
  }

  public async listUpdate(key: string, where: any, payload: any, schema: Field): Promise<any> {
    return this.request({
      key,
      type: Action.listUpdate,
      payload: {payload, where}
    });
  }

  public async listDelete(key: string, where: any, schema: Field): Promise<any> {
    return this.request({
      key,
      type: Action.listDelete,
      payload: {where}
    });
  }

  private request(body: any) {
    const merged = {
      ...body,
      appId: this.appId,
      env: this.env,
      service: this.service,
      resourceId: this.resourceId,
      connectorName: this.connectorName,
      connectorParams: this.connectorParams,
      rootSchema: this.rootSchema
    };
    return fetch(endpointTargetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.secret}`
      },
      body: JSON.stringify(merged)
    })
    .then(res => {
      if (!res.ok) {
        throw new Error('request error at connector');
      }
      return res.json();
    })
    .then(data => data.result);
  }
}
