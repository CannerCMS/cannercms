import { Connector, Pagination } from './types';
import DataLoader from 'dataloader';
import { reduce } from 'lodash';
import { Field } from 'canner-graphql-utils/lib/schema/types';
import { paginator } from 'canner-graphql-utils';

export default class DataLoaderConnector implements Connector {
  private connector: Connector;
  private dataLoaders: Record<string, DataLoader<{id: string, fetch?: any}, any>>;

  constructor(
    {keys, connector}:
    {keys: string[], connector: Connector}) {
    this.connector = connector;
    this.dataLoaders = reduce(keys, (result, key) => {
      result[key] = new DataLoader<{id: string, fetch?: any}, any>(async objs => {
        // get one-by-one
        return Promise.all(objs.map(
          ({fetch}) => fetch()
        ));
      }, {
        cacheKeyFn: obj => obj.id
      });
      return result;
    }, {});
  }

  public async listResolveByUnique(
    { key, field, schema }: { key: string; field: { [key: string]: any; }; schema: Field }): Promise<any> {
    // assuming id is used in field
    return this.dataLoaders[key].load({
      id: field.id,
      fetch: () => this.connector.listResolveByUnique({key, field, schema})
    });
  }

  public async listResolveQuery(
    {key, where, order, pagination, schema}:
    {key: string, where: any, order: any; pagination: Pagination; schema: Field}): Promise<any> {
    const res = await this.connector.listResolveQuery({key, where, order, pagination, schema});

    // prime the cache
    res.edges.forEach(edge => {
      this.dataLoaders[key].prime({id: edge.node.id}, edge.node);
    });

    // return to client
    return res;
  }

  public async resolveToOne({ from, to, id, schema }:
    { from: string, to: string, id: string, schema: Field }): Promise<any> {
    return this.dataLoaders[to].load({
      id,
      fetch: () => this.connector.resolveToOne({from, to, id, schema})
    });
  }

  public async resolveToMany(
    { from, to, ids, pagination, schema }:
    { from: string, to: string, ids: [string], pagination: Pagination, schema: Field}): Promise<any> {
    // ignore pagination to fetch
    const rows = ids ? await this.dataLoaders[to].loadMany(
      ids.map(id => ({
        id,
        fetch: () => this.connector.listResolveByUnique({key: to, field: {id}, schema})
      }))
    ) : [];
    return paginator(rows, pagination);
  }

  public async mapResolve(key: string, schema: Field) {
    return this.connector.mapResolve(key, schema);
  }

  public async hasNextPage(args) {
    return this.connector.hasNextPage(args);
  }

  public mapUpdate(key: string, payload: any, schema: Field): Promise<any> {
    return this.connector.mapUpdate(key, payload, schema);
  }

  public async listCreate(key: string, payload: any, schema: Field): Promise<any> {
    return this.connector.listCreate(key, payload, schema);
  }

  public async listUpdate(key: string, where: any, payload: any, schema: Field): Promise<any> {
    return this.connector.listUpdate(key, where, payload, schema);
  }

  public async listDelete(key: string, where: any, schema: Field): Promise<any> {
    return this.connector.listDelete(key, where, schema);
  }
}
