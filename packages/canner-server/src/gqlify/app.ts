import path from 'path';
import Koa from 'koa';
import { Gqlify } from '@gqlify/server';
import { ScalarField } from '@gqlify/server/lib/dataModel';
import { DataModelType } from '@gqlify/server/lib/dataModel/type';
import { CannerSchemaToGQLifyParser } from '@gqlify/canner-schema-to-gqlify-model';
import { readFileSync } from 'fs';
import { ApolloServer } from 'apollo-server-koa';
import GraphQLJSON from 'graphql-type-json';
import {
  GraphQLDateTime
} from 'graphql-iso-date';
import { WebService, Logger } from '../common/interface';
import { jsonLogger } from '../common/jsonLogger';
import { GqlifyConfig } from './config';

export class GraphQLService implements WebService {
  private logger: Logger = jsonLogger;
  private apolloServer: ApolloServer;

  constructor(config: GqlifyConfig = {}) {
    if (!config.dataSources) {
      throw new Error(`require dataSources`);
    }

    // Read datamodel
    const schemaPath = path.resolve(process.cwd(), config.schemaPath || 'canner.schema.json');
    const cannerSchema = JSON.parse(readFileSync(schemaPath, { encoding: 'utf8' }));
    const parser = new CannerSchemaToGQLifyParser(cannerSchema);

    const {models, rootNode} = parser.parse();

    // add unique id
    for (const model of models) {
      const idField = model.getField('id');
      if (!idField) {
        model.appendField(
          'id',
          new ScalarField({ type: DataModelType.ID, nonNull: true, unique: true, autoGen: true }));
      }
    }

    // construct gqlify
    const gqlify = new Gqlify({
      rootNode,
      models,
      dataSources: config.dataSources,
      scalars: {
        JSON: GraphQLJSON,
        DateTime: GraphQLDateTime,
      }
    });

    this.apolloServer = new ApolloServer(gqlify.createApolloConfig());
  }

  public async mount(app: Koa) {
    this.apolloServer.applyMiddleware({app});
  }

  public setLogger(logger: Logger): void {
    this.logger = logger;
  }

  public getLogger(): Logger {
    return this.logger;
  }
}
