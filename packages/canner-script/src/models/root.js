// @flow

import type { CannerSchema } from '../flow-types';
import {
  parseConnector, parseGraphqlClient,
  parseGraphqlClients, parseResolvers, genStorages,
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

  imageStorages: Object;

  fileStorages: Object;

  graphqlClient: any;

  constructor(attrs: CannerSchema, children: Array<CannerSchema>) {
    const dataSchema = children.slice()
      .filter(child => child.type === 'object' || child.type === 'array')
      .reduce((result: Object, child: Object) => {
        if (child.keyName in result) {
          throw new Error(`Schema Error: duplicated name in children of ${this.keyName}`);
        }
        if (child.type === 'array' && !child.toolbar) {
          // default pagination in first array
          child.toolbar = {
            pagination: {},
          };
        }
        result[child.keyName] = child;
        return result;
      }, {});
    const pageSchema = children.filter(child => child.type === 'page')
      .reduce((result: Object, child: Object) => {
        result[child.keyName] = child;
        return result;
      }, {});
    this.dict = attrs.dict || {};
    this.schema = dataSchema;
    this.pageSchema = pageSchema;
    this.visitors = visitorManager.getAllVisitors();
    this.imageStorages = genStorages(attrs, children, 'imageStorage');
    this.fileStorages = genStorages(attrs, children, 'fileStorage');
    this.resolvers = parseResolvers(attrs, children);
    this.connector = parseConnector(attrs, children) || parseConnector(attrs, children);
    this.graphqlClient = parseGraphqlClient(attrs, children) || parseGraphqlClients(attrs, children);
  }

  toJson() {
    return {
      dict: this.dict,
      schema: this.schema,
      pageSchema: this.pageSchema,
      visitors: this.visitors,
      imageStorages: this.imageStorages,
      fileStorages: this.fileStorages,
      resolvers: this.resolvers,
      connector: this.connector,
      graphqlClient: this.graphqlClient,
    };
  }
}
