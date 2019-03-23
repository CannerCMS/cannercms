import path from 'path';
import Koa from 'koa';
import { Gqlify, MemoryDataSource } from '@gqlify/server';
import { ScalarField } from '@gqlify/server/lib/dataModel';
import { DataModelType } from '@gqlify/server/lib/dataModel/type';
import { CannerSchemaToGQLifyParser } from '@gqlify/canner-schema-to-gqlify-model';
import { readFileSync } from 'fs';
import { ApolloServer } from 'apollo-server-koa';
import GraphQLJSON from 'graphql-type-json';
import {
  GraphQLDateTime
} from 'graphql-iso-date';
import { WebService, Logger } from '@canner/server-common/lib/interface';
import { GqlifyConfig } from './config';
import { readOnlyMiddleware } from '@canner/server-common/lib/graphql';
import { makeExecutableSchema } from 'graphql-tools';
import { applyMiddleware } from 'graphql-middleware';
import { apolloErrorHandler } from './error';
import { createContext } from './context';

export class GraphQLService implements WebService {
  private logger: Logger;
  private apolloServer: ApolloServer;

  constructor(config: GqlifyConfig = {}) {
    if (!config.dataSources) {
      throw new Error(`require dataSources`);
    }

    // logger
    this.logger = config.logger;

    // Read datamodel
    const cannerSchema = this.getCannerSchema(config);
    const parser = new CannerSchemaToGQLifyParser(cannerSchema);

    const {models, rootNode} = parser.parse();

    // add unique id
    for (const model of models) {
      const idField = model.getField('id');
      if (!idField && !model.isObjectType()) {
        model.appendField(
          'id',
          new ScalarField({ type: DataModelType.ID, nonNull: true, unique: true, autoGen: true }));
      }
    }

    // inject memory dataSource
    const dataSources = {
      memory: () => new MemoryDataSource(),
      ...config.dataSources,
    };

    // construct gqlify
    const gqlify = new Gqlify({
      rootNode,
      models,
      dataSources,
      scalars: {
        JSON: GraphQLJSON,
        DateTime: GraphQLDateTime,
      },
      plugins: config.plugins,
    });

    const { typeDefs, resolvers } = gqlify.createApolloConfig();
    const schema = makeExecutableSchema({
      typeDefs: typeDefs as any,
      resolvers
    });
    const schemaWithMiddleware = applyMiddleware(schema, readOnlyMiddleware);

    // context
    const context = config.context || createContext(config);

    this.apolloServer = new ApolloServer({
      ...config.apolloConfig,
      debug: true,
      playground: config.graphqlPlayground,
      schema: schemaWithMiddleware as any,
      formatError: (error: any) => {
        return apolloErrorHandler(error, this.logger);
      },
      context,
    });
  }

  public async mount(app: Koa) {
    this.apolloServer.applyMiddleware({app});
  }

  private getCannerSchema(config: GqlifyConfig) {
    if (config.schema) {
      return config.schema;
    }

    // read from schemaPath
    const schemaPath = path.resolve(process.cwd(), config.schemaPath || 'canner.schema.json');
    const cannerSchema = JSON.parse(readFileSync(schemaPath, { encoding: 'utf8' }));
    return cannerSchema;
  }
}
