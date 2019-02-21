import {LocalStorageConnector, createClient} from 'canner-graphql-interface';
import {createFakeData} from 'packages/canner-helpers/src';
import chartFakeData from './schema/fake-data';
import schema from './canner.schema';

const fakeData = createFakeData(schema.schema, 10);
const connector = new LocalStorageConnector({
  defaultData: {...fakeData, ...chartFakeData},
  localStorageKey: 'cannerDEMO'
});
const client = createClient({
  schema: schema.schema,
  connector
});

export default client;
