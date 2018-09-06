// @flow

import type {CannerSchema} from '../flow-types';
import {parseConnector, parseGraphqlClient,
  parseGraphqlClients, parseResolvers, genStorages
} from '../utils';
import visitorManager from '../visitorManager';

export default class RootModel {
  items: CannerSchema | {[string]: CannerSchema};
  keyName: string;
  dict: Object;
  schema: Object;
  pageSchema: Object;
  connector: any;
  resolvers: Object;
  visitors: Array<any>;
  entry: Array<any>;
  storages: Object;
  graphqlClient: any;

  constructor(attrs: CannerSchema, children: Array<CannerSchema>) {
    if (window && window.document) {
      // onbrowser
      const schema = children.slice()
        .filter(child => child.type === 'object' || child.type === 'array')
        .reduce((result: Object, child: Object) => {
          if (child.keyName in result) {
            throw new Error(`duplicated name in children of ${this.keyName}`);
          }
          if (child.type === 'array' && !child.toolbar) {
            child.toolbar = {
              pagination: {}
            }
          }
          delete child.endpoint;
          result[child.keyName] = child;
          return result;
        }, {});
      const pageSchema = children.filter(child => child.type === 'page')
        .reduce((result: Object, child: Object) => {
          result[child.keyName] = child;
          return result;
        }, {});
      this.dict = attrs.dict || {};
      this.schema = schema;
      this.pageSchema = pageSchema;
      this.visitors = visitorManager.getAllVisitors();
    } else {
      this.entry = children.map(child => child.keyName);
    }
    this.storages = genStorages(attrs, children);
    this.resolvers = parseResolvers(attrs, children);
    this.connector = parseConnector(attrs, children) || parseConnector(attrs, children);
    this.graphqlClient = parseGraphqlClient(attrs, children) || parseGraphqlClients(attrs, children);
  }

  toJson() {
    // $FlowFixMe
    const renderView = {
      dict: this.dict,
      schema: this.schema,
      pageSchema: this.pageSchema,
      visitors: this.visitors,
      storages: this.storages,
      resolvers: this.resolvers,
      connector: this.connector,
      graphqlClient: this.graphqlClient
    };
    if (typeof window === 'undefined') { 
      // support SSR
      return renderView;
    } else if (window && !window.document) {
      // CLI node env
      return {
        entry: this.entry,
        storages: this.storages,
        resolvers: this.resolvers,
        connector: this.connector,
        graphqlClient: this.graphqlClient
      };
    } else {
      return renderView;
    }
  }
}