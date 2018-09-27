/** @jsx builder */

import builder from 'canner-script';
import Dashboard from './schema/Dashboard.schema';
import Customers from './schema/customers.schema';
import Home from './schema/home.schema';
import Orders from './schema/orders.schema';
import Categories from './schema/categories.schema';
import Products from './schema/products.schema';
import utils from './utils';
import dict from './schema/locale';

const {connector, imageStorage} = utils;
export default <root connector={connector} imageStorage={imageStorage} dict={dict}>
  <Dashboard />
  <Home />
  <Products />
  <Categories />
  <Orders />
  <Customers />
</root>
