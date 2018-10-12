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
import fakeData from './schema/fake-data';

const schema = (
  <root dict={dict}>
    <Dashboard />
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
    {/* <Products />
    <Categories /> */}
    {/* <Home />
    <Orders />
    <Customers /> */}
  </root>
);

const connector = new LocalStorageConnector({
  defaultData: fakeData
});

export default {
  ...schema,
  connector: connector
}
