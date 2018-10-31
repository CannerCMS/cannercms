/** @jsx builder */

import builder, {Default} from 'canner-script';
import {LocalStorageConnector} from 'packages/canner-graphql-interface/src';
import {createFakeData} from 'packages/canner-helpers/src';
import Dashboard from './schema/Dashboard.schema';
import Customers from './schema/customers.schema';
import Home from './schema/home.schema';
import Orders from './schema/orders.schema';
import Categories from './schema/categories.schema';
import Products from './schema/products.schema';
import dict from './schema/locale';
import fakeData from './schema/fake-data';

const schema = (
  <root dict={dict}>
    <Default>
      <Dashboard />
    </Default>
    <objectType keyName="chart">
      <array keyName="visitData">
        <number keyName="x"/>
        <number keyName="y"/>
      </array>
      <array keyName="salesData">
        <number keyName="x"/>
        <number keyName="y"/>
      </array>
      <array keyName="salesTypeDataOnline">
        <string keyName="x"/>
        <number keyName="y"/>
      </array>
      <array keyName="salesTypeDataOffline">
        <string keyName="x"/>
        <number keyName="y"/>
      </array>
    </objectType>
    <Products />
    <Categories />
    <Home />
    <Orders />
    <Customers />
  </root>
);

const fD = createFakeData(schema.schema, 10);

const connector = new LocalStorageConnector({
  defaultData: {...fD, ...fakeData}
});

export default {
  ...schema,
  connector
}
