import path from 'path';

import { ServiceAccount } from 'firebase-admin';
import  { Gqlify, MemoryDataSource } from '@gqlify/server';
import { ScalarField, Model } from '@gqlify/server/lib/dataModel';
import { DataModelType } from '@gqlify/server/lib/dataModel/type';
import { CannerSchemaToGQLifyModel, IDataSourceOption } from '@gqlify/canner-schema-to-gqlify-model';
import  { ApolloServer } from 'apollo-server';
import { readFileSync } from 'fs';

interface ICreateAppOptions {
  schemaPath?: string;
  dataSources?: Record<string, IDataSourceOption>;
}

export const createApp = async (options: ICreateAppOptions = {}): Promise<{app: ApolloServer}> => {
  // Read datamodel
  const schemaPath = path.resolve(process.cwd(), options.schemaPath || 'schema.node.js');
  const cannerSchema = JSON.parse(readFileSync(schemaPath, { encoding: 'utf8' }));
  const cannerSchemaToGQLifyModel = new CannerSchemaToGQLifyModel(cannerSchema, new MemoryDataSource());

  const models: Model[] = Object.values(cannerSchemaToGQLifyModel.models);
  for(const model of models) {
    const idField = model.getField('id');
    if (!idField) {
      model.appendField('id', new ScalarField({ type: DataModelType.ID, nonNull: true, unique: true }))
    }
  }
  // construct gqlify
  const gqlify = new Gqlify({
    rootNode: cannerSchemaToGQLifyModel.rootNode,
    models
  });

  // GQLify will provide GraphQL apis & resolvers to apollo-server
  const server = new ApolloServer(gqlify.createApolloConfig());
  return { app: server };
}
