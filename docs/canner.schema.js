/** @jsx c */
// const CannerTypes = require('@canner/canner-types');
import c, {Block} from '@canner/canner-script';

export default <root>
  <array keyName="posts" title="Posts">
    <object keyName="status">
      <date keyName="createAt" />
      <number keyName="draft" />
    </object>
    <string keyName="featureImage" />
    <object keyName="pageProperty">
      <number keyName="onTop" />
      <number keyName="order" />
    </object>
    <object keyName="share">
      <number keyName="showShareBottom" />
      <number keyName="showGoodBottom" />
    </object>
    <object keyName="other">
      <string keyName="introduction" />
      <geoPoint keyName="position" />
    </object>
  </array>
  <object keyName="info" title="Info">
    {/* <Block> */}
      <string keyName="name" title="Name" />
      <string keyName="description" title="Desc" />
    {/* </Block> */}
    <object keyName="info" title="Info">
      <object keyName="info2" title="Info2">
        <string keyName="name2" title="Name" />
      </object>
    </object>
    
    {/* <object keyName="info" title="Info">
      <string keyName="name" title="Name" />
      <string keyName="description" title="Desc" />
      <object keyName="info" title="Info">
        <string keyName="name" title="Name" />
        <string keyName="description" title="Desc" />
        <object keyName="info" title="Info">
          <string keyName="name" title="Name" />
          <string keyName="description" title="Desc" />
        </object>
      </object>
    </object>
    <array ui="popup" keyName="popup" title="Popup" uiParams={{
      columns: [{
        title: 'name',
        dataIndex: 'name',
        key: 'name'
      }]
    }}>
      <string keyName="name" title="Name" />
    </array> */}
  </object>
  <array keyName="popup" title="Popup">
    <string keyName="name" title="Name" />
  </array>
  <array ui="tab" keyName="tab" title="Tab">
    <string keyName="name" title="Name" />
  </array>
  <array
    title="Title"
    uiParams={{
      columns: [{
        title: 'name',
        dataIndex: 'name',
        key: 'name'
      }]
    }}
  >
    <string keyName="name" title="Name" />
  </array>
</root>

