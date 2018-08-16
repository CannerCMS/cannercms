import { Field } from 'canner-graphql-utils/lib/schema/types';

export interface Pagination {
  last: number;
  first: number;
  before: string;
  after: string;
}

export interface Connector {
  connect?: () => Promise<void>;
  prepare?: (props: any) => Promise<void>;
  disconnect?: () => Promise<void>;
  equals?(connector: Connector): boolean;

  // list
  preListResolveByUnique?({document}: {document: any}): any;
  listResolveByUnique(
    {key, field, document, schema}:
    {key: string, field: {[key: string]: any}, document?: any, schema?: any}): Promise<any>;
  postListResolveByUnique?({document, value}: {document: any, value: any}): any;
  listResolveQuery(
    {key, where, order, pagination, document, schema}:
    {key: string, where?: any, order?: any; pagination?: Pagination, document?: any, schema?: any}): Promise<any>;
  hasNextPage({key, id}: {key: string, id: string}): Promise<any>;

  // relation
  resolveToOne({from, to, id, schema}: {from: string, to: string, id: string, schema: Field}): Promise<any>;
  resolveToMany(
    {from, to, ids, pagination, schema}:
    {from: string, to: string, ids: [string], pagination: Pagination, schema: Field}): Promise<any>;

  // map
  mapResolve(key: string, schema: Field): Promise<any>;
  mapUpdate(key: string, payload: any, schema: Field): Promise<any>;

  // mutation
  // list
  listCreate(key: string, payload: any, schema: Field): Promise<any>;
  listUpdate(key: string, where: any, payload: any, schema: Field): Promise<any>;
  listDelete(key: string, where: any, schema: Field): Promise<any>;
}
