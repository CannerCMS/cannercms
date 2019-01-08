import  { Gqlify, MemoryDataSource } from '@gqlify/server';
import { ScalarField } from '@gqlify/server/lib/dataModel';
import { DataModelType } from '@gqlify/server/lib/dataModel/type';
import { CannerSchemaToGQLifyModel } from '@gqlify/canner-schema-to-gqlify-model';
import  { ApolloServer } from 'apollo-server';
import { readFileSync } from 'fs';

// Read datamodel
const cannerSchema = JSON.parse(readFileSync(__dirname + '/canner.schema.js', { encoding: 'utf8' }));
const cannerSchemaToGQLifyModel = new CannerSchemaToGQLifyModel(cannerSchema, new MemoryDataSource());

const models = Object.values(cannerSchemaToGQLifyModel.models);
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

// start server
server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
