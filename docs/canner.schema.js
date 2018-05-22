/** @jsx builder */

import builder, {Block, Layout} from 'canner-script';
import Strings from './schema/string.schema';
import Numbers from './schema/number.schema';
import Booleans from './schema/boolean.schema';
import Objects from './schema/object.schema';
import Arrays from './schema/array.schema';
import Posts from './schema/realWorld/posts.schema';
import Users from './schema/realWorld/users.schema';
import OnDeploy from './schema/onDeploy.schema';

const Tabs = ({attributes, children}) => <Layout name="Tabs" {...attributes}>{children}</Layout>;
const userColumns = [{
  title: 'Name',
  dataIndex: 'name'
}, {
  title: 'Email',
  dataIndex: 'email'
}, {
  title: 'Age',
  dataIndex: 'age'
}];

const postColumns = [{
  title: 'Title',
  dataIndex: 'title'
}];

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
  <object keyName="home" title="Home" description="t to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of L ">
    <Block title="Basic">
      <number keyName="count" title="Count"/>
      <relation title="StaredPosts" description="Ref to Posts" keyName="staredPosts" relation={{to: 'posts', type: 'toMany'}} ui="multipleSelect" uiParams={{textCol: 'title', columns: postColumns}}/>
      <relation title="BestAuthor" description="Ref to Users" keyName="bestAuthor" relation={{to: 'users', type: 'toOne'}} uiParams={{textCol: 'name', columns: userColumns}}/>
    </Block>
    <Block title="Header">
      <object keyName="header">
        <string keyName="title" title="Title"/>
        <string keyName="subTitle" title="Subtitle"/>
      </object>
    </Block>
    <Block title="Navs">
      <array keyName="navs">
        <string keyName="text" />
      </array>
    </Block>
  </object>
  <Posts ui="table-route" uiParams={{
    columns: postColumns
  }}>
    <toolbar>
      <pagination />
      <filter fields={[{
        key: 'title',
        type: 'text',
        label: 'Title'
      }]}/>
    </toolbar>
  </Posts>
  <Users ui="table-route" uiParams={{
    columns: userColumns
  }}>
    <toolbar>
      <pagination />
      <sort options={[{
        key: 'age',
        title: 'Age'
      }]}/>
      <filter fields={[{
        key: 'age',
        type: 'number',
        label: 'Age'
      }]}/>
    </toolbar>
  </Users>
  <OnDeploy
    keyName="test1"
    title="OnDeploy Demo"
  />
</root>
