/** @jsx builder */

import builder, { Body } from 'canner-script';
import Dashboard from './schema/dashboard.schema';
import Customers from './schema/customers.schema';
import Home from './schema/home.schema';
import Orders from './schema/orders.schema';
import Categories from './schema/categories.schema';
import Products from './schema/products.schema';
import dict from './schema/locale';
import DashboardBody from './components/layouts/dashboardBody';
import ProductsBody from './components/layouts/productsBody';
import HomeBody from './components/layouts/homeBody';
import OrderBody from './components/layouts/orderBody';

const schema = (
  <root dict={dict}>
    <Body component={DashboardBody}>
      <Dashboard />
    </Body>
    <objectType keyName="chart">
      <array keyName="visitData">
        <number keyName="x" />
        <number keyName="y" />
      </array>
      <array keyName="salesData">
        <number keyName="x" />
        <number keyName="y" />
      </array>
      <array keyName="salesTypeDataOnline">
        <string keyName="x" />
        <number keyName="y" />
      </array>
      <array keyName="salesTypeDataOffline">
        <string keyName="x" />
        <number keyName="y" />
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

export default {
  ...schema
};
