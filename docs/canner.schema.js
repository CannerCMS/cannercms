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
import tabs from './layouts/tabs';

const Tabs = ({attributes, children}) => <Layout component={tabs} {...attributes}>{children}</Layout>;
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

// export default <root>
//   <object keyName="info">
//     <array keyName="tag" ui="tag" uiParams={{defaultOptions: []}}>
//       <string/>
//     </array>
//   </object>
// </root>

export default <root>
  <object keyName="overview" title="Components Overview">
    <Block title="All Types">
      <Tabs>
        <Strings keyName="string" title="String Type" />
        {/* <Booleans keyName="boolean" title="Boolean Type"/>
        <Numbers keyName="number" title="Number Types" />
        <Arrays keyName="array" title="Array Type" />
        <Objects keyName="object" title="Object type" /> */}
      </Tabs>
    </Block>
    <Block title="test">
      <array keyName="tag" ui="tag" uiParams={{defaultOptions: []}}>
        <string />
      </array>
      
      <array keyName="slider" ui="slider">
        <string />
      </array>
      <array keyName="gallery" ui="gallery" title="Gallery">
        <image />
      </array>
      <image keyName="image" ui="image" title="Image" />
      <object keyName="editor" ui="editor" />
      {/* <geoPoint keyName="map" title="Map" /> */}
    </Block>
  </object>
  {/* <object keyName="home" title="Home" description="t to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of L ">
    <Block title="Basic">
      <number keyName="count" title="Count"/>
      <relation title="StaredPosts" description="Ref to Posts" keyName="staredPosts" relation={{to: 'posts', type: 'toMany'}} ui="multipleSelect" uiParams={{textCol: 'title', columns: postColumns}}/>
      <relation title="BestAuthor" description="Ref to Users" keyName="bestAuthor" relation={{to: 'users', type: 'toOne'}} uiParams={{textCol: 'name', columns: userColumns}}/>
    </Block>
    <Block title="Header">
      <object keyName="header">
        <string keyName="title" title="Title"/>
        <string keyName="subTitle" title="Subtitle"/>
        <object keyName="desc" title="Description" ui="editor"/>
      </object>
    </Block>
    <Block title="Navs">
      <array keyName="navs">
        <string keyName="text" />
      </array>
    </Block>
  </object>
  <Posts ui="tableRoute" uiParams={{
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
  <Users ui="table" uiParams={{
    columns: userColumns
  }}>
    <toolbar>
      <pagination />
      <sort options={[{
        key: 'age',
        title: 'Age'
      }]}/>
      <filter fields={[{
        title: 'All',
        condition: {
        }
      }, {
        title: 'Draft',
        condition: {
          status: {
            draft: {
              eq: true
            }
          }
        }
      }, {
        title: 'Stick',
        condition: {
          status: {
            stick: {
              eq: true
            }
          }
        }
      }]} search={{
        title: 'Search name',
        key: 'name'
      }} componentName="TabsFilter"/>
    </toolbar>
  </Users>
  <array keyName="test" title="array" uiParams={{columns: [{title: 'title', dataIndex: 'title'}]}}>
    <string keyName="title" />
    <OnDeploy
      keyName="test1"
      title="OnDeploy Demo"
    />
  </array> */}
</root>
