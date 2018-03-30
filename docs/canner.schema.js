/** @jsx c */
// const CannerTypes = require('@canner/canner-types');
import c, {Block} from '@canner/canner-script';

module.exports = <root>
  <array name="posts" ui="breadcrumb" title="Posts">
    <object name="status">
      <date name="createAt" />
      <number name="draft" />
    </object>
    <string name="featureImage" />
    <object name="pageProperty">
      <number name="onTop" />
      <number name="order" />
    </object>
    <object name="share">
      <number name="showShareBottom" />
      <number name="showGoodBottom" />
    </object>
    <object name="other">
      <string name="introduction" />
      <mapPoint name="position" />
    </object>
  </array>
  <object name="info" title="Info">
    <string name="name" title="Name" />
    <string name="description" title="Desc" />
    <object name="info" title="Info">
      <string name="name" title="Name" />
      <string name="description" title="Desc" />
      <object name="info" title="Info">
        <string name="name" title="Name" />
        <string name="description" title="Desc" />
        <object name="info" title="Info">
          <string name="name" title="Name" />
          <string name="description" title="Desc" />
        </object>
      </object>
    </object>
    <array name="popup" title="Popup" uiParams={{
      columns: [{
        title: 'name',
        dataIndex: 'name',
        key: 'name'
      }]
    }}>
      <string name="name" title="Name" />
    </array>
  </object>
  <array name="popup" title="Popup">
    <string name="name" title="Name" />
  </array>
  <array ui="tab" name="tab" title="Tab">
    <string name="name" title="Name" />
  </array>
  <array
    ui="breadcrumb"
    title="Title"
    uiParams={{
      columns: [{
        title: 'name',
        dataIndex: 'name',
        key: 'name'
      }]
    }}
  >
    <string name="name" title="Name" />
  </array>
</root>

