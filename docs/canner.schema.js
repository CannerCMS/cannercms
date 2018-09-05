/** @jsx builder */

import builder from 'canner-script';
import Posts from './schema/posts.schema';
import Users from './schema/users.schema';
import Home from './schema/home.schema';
import Condition from './schema/condition.schema';
import SelfRelation from './schema/selfRelation.schema';
import RowAndCol from './schema/rowAndCol.schema';
import utils from './utils';
const {connector} = utils;


export default <root connector={connector}>
  <Home />
  <Posts/>
  <Users/>
  <SelfRelation />
  <Condition />
  <RowAndCol />
</root>
