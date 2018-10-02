/** @jsx builder */

import builder from 'canner-script';
import {LocalStorageConnector} from 'packages/canner-graphql-interface/src';
import {createFakeData} from 'packages/canner-helpers/src';
import Dashboard from './schema/Dashboard.schema';
import Customers from './schema/customers.schema';
import Home from './schema/home.schema';
import Orders from './schema/orders.schema';
import Categories from './schema/categories.schema';
import Products from './schema/products.schema';
import {ImgurStorage} from 'packages/canner-storage/src';
import dict from './schema/locale';

const imageStorage = new ImgurStorage({
  clientId: process.env.IMGUR_DEV_CLIENT_ID
});

const schema = <root imageStorage={imageStorage} dict={dict}>
  <Dashboard />
  <Home />
  <Products />
  <Categories />
  <Orders />
  <Customers />
</root>;
const fakeData = createFakeData(schema.schema, 5);
const connector = new LocalStorageConnector({
  defaultData: fakeData
});
console.log(fakeData);
export default {
  ...schema,
  connector: connector
}
