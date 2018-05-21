/** @jsx builder */

import builder, {Block, Layout} from 'canner-script';
import Strings from './schema/string.schema';
import Numbers from './schema/number.schema';
import Booleans from './schema/boolean.schema';
import Objects from './schema/object.schema';
import Arrays from './schema/array.schema';
import Posts from './schema/realWorld/posts.schema';
import Users from './schema/realWorld/users.schema';
const Tabs = ({attributes, children}) => <Layout name="Tabs" {...attributes}>{children}</Layout>;

export default <root>
  <object keyName="overview" title="Components Overview">
    <Block title="All Types">
      <Tabs>
        <Strings keyName="string" title="String Type" />
        <Booleans keyName="boolean" title="Boolean Type"/>
        <Numbers keyName="number" title="Number Types" />
        <Arrays keyName="array" title="Array Type" />
        <Objects keyName="object" title="Object type" />
      </Tabs>
    </Block>
  </object>
  <object keyName="home" title="Home">
    <object keyName="header">
      <string keyName="title" title="Title"/>
      <string keyName="subTitle" title="Title"/>
    </object>
    <number keyName="count" />
    <array keyName="navs">
      <string keyName="text" />
    </array>
    <relation keyName="staredPosts" relation={{to: 'posts', type: 'toMany'}} ui="multipleSelect" uiParams={{textCol: 'title'}}/>
    <relation keyName="bestAuthor" relation={{to: 'users', type: 'toOne'}} uiParams={{textCol: 'title'}}/>
  </object>
  <Posts />
  <Users cacheActions={true} uiParams={{
    columns: [{
      title: 'name',
      dataIndex: 'name'
    }]
  }} controlDeployAndResetButtons>
    <toolbar>
      <pagination />
      <sort options={[{
        key: 'star',
        title: 'Star'
      }]}/>
      <filter fields={[{
        key: 'star',
        type: 'number',
        label: 'Star'
      }]}/>
    </toolbar>
  </Users>
</root>
