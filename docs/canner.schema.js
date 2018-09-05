/** @jsx builder */

import builder, {Block, Tabs} from 'canner-script';
import Strings from './schema/string.schema';
import Numbers from './schema/number.schema';
import Booleans from './schema/boolean.schema';
import Objects from './schema/object.schema';
import Arrays from './schema/array.schema';
import Posts from './schema/realWorld/posts.schema';
import Users from './schema/realWorld/users.schema';
import Home from './schema/realWorld/home.schema';
import Condition from './schema/condition.schema';
import SelfRelation from './schema/selfRelation.schema';
import RowAndCol from './schema/rowAndCol.schema';
import TabsFilter from './toolbar/filter';
import utils from './utils';
const {connector, storage, renderImages, renderPosts} = utils;
// const connector = undefined;
// const storage = undefined;
const userColumns = [{
  title: 'Name',
  dataIndex: 'name'
}, {
  title: 'Email',
  dataIndex: 'email',
}, {
  title: 'Age',
  dataIndex: 'age'
}, {
  title: 'Login',
  dataIndex: 'isLogin'
}, {
  title: 'Images',
  dataIndex: 'images',
  render: renderImages
}, {
  title: 'Hobbies',
  dataIndex: 'hobbies'
}, {
  title: 'Posts',
  dataIndex: 'posts',
  render: renderPosts
}];

const postColumns = [{
  title: 'Title',
  dataIndex: 'title',
  sorter: (a, b) => a.title > b.title
}, {
  title: 'User',
  dataIndex: 'author.name',
  sorter: (a, b) => a.author.name > b.author.name
}, {
  title: 'Clicks',
  dataIndex: 'clicks'
}];

export default <root connector={connector}>
  <object keyName="overview"
    title="Components Overview"
    storage={storage}
  >
    {/* <Block title="All Types">
      <Tabs> */}
        <Strings keyName="string" title="String Type" />
        <Booleans keyName="boolean" title="Boolean Type"/>
        <Numbers keyName="number" title="Number Types" />
        <Arrays keyName="array" title="Array Type" />
        <Objects keyName="object" title="Object type" />
      {/* </Tabs>
    </Block> */}
  </object>
  <Home userColumns={userColumns} postColumns={postColumns}/>
  <Posts columns={postColumns} />
  <Users columns={userColumns} searchComponent={TabsFilter} />
  <SelfRelation />
  <Condition />
  <RowAndCol />
</root>
