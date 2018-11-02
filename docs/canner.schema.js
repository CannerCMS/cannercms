/** @jsx builder */

<<<<<<< HEAD
import builder, {Default} from 'canner-script';
=======
import builder, {Body} from 'canner-script';
>>>>>>> 5322cd80f0a3dda5907817131d4d452aaebf0fd1
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
import DashboardBody from './components/layouts/dashboardBody';
import ProductsBody from './components/layouts/productsBody';
import HomeBody from './components/layouts/homeBody';
import OrderBody from './components/layouts/orderBody';

const schema = (
  <root dict={dict}>
<<<<<<< HEAD
    <Default>
      <Dashboard />
    </Default>
=======
    <Body component={DashboardBody}>
      <Dashboard />
    </Body>
>>>>>>> 5322cd80f0a3dda5907817131d4d452aaebf0fd1
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
    <Body component={ProductsBody}>
      <Products />
    </Body>
    <Categories />
    <Body component={HomeBody}>
      <Home />
    </Body>
    <Body component={OrderBody}>
      <Orders />
    </Body>
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
