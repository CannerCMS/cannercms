/** @jsx builder */

import 'babel-register';
import builder, {Block, Layout} from 'canner-script';
import Strings from './schema/string.schema';
import Numbers from './schema/number.schema';
import Booleans from './schema/boolean.schema';
import Objects from './schema/object.schema';
import Arrays from './schema/array.schema';
import Posts from './schema/realWorld/posts.schema';
import Users from './schema/realWorld/users.schema';
const Tabs = ({attributes, children}) => <Layout name="Tabs" {...attributes}>{children}</Layout>;
import {MemoryConnector} from '@canner/graphql-resolver';

// import firebase from 'firebase';
// firebase.initializeApp({
//   apiKey: "AIzaSyDXsFofZTaEk6SIhDj0Ot4YuPidKAfY750",
//   authDomain: "test-new-qa.firebaseapp.com",
//   databaseURL: "https://test-new-qa.firebaseio.com",
//   projectId: "test-new-qa",
//   storageBucket: "test-new-qa.appspot.com",
//   messagingSenderId: "983887338585"
// });
// const defaultApp = firebase.app();
export default <root connector={new MemoryConnector({
  defaultData: {
    overview: {
      string: {
        input: 'test123'
      }
    }
  }
})}>
  <object keyName="info">
    <array keyName="navs">
      <string keyName="title" />
    </array>
  </object>
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
