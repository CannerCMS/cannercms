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
import OnDeploy from './schema/onDeploy.schema';
import TabsFilter from './toolbar/filter';
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
    <Block title="test">
      <array keyName="tag" ui="tag" uiParams={{defaultOptions: []}}>
        <string />
      </array>
      
      <array keyName="slider" ui="slider">
        <string />
      </array>
      <array keyName="gallery" ui="gallery" title="Gallery" />
      <image keyName="image" ui="image" title="Image" />
      <object keyName="editor" ui="editor" />
      {/* <geoPoint keyName="map" title="Map" /> */}
    </Block>
  </object>
  <Home userColumns={userColumns} postColumns={postColumns}/>
  <Posts columns={postColumns} />
  <Users columns={userColumns} searchComponent={TabsFilter} />
  <array keyName="test" title="array" uiParams={{columns: [{title: 'title', dataIndex: 'title'}]}}>
    <string keyName="title" title="title"/>
    <OnDeploy
      keyName="test1"
      title="OnDeploy Demo"
    />
    <array keyName="gallery" packageName="./components/def-array-gallery"/>
  </array>
</root>
