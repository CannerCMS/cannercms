/** @jsx builder */

import builder from 'canner-script';
const Arrays = ({attributes}) => <object {...attributes}>
  <array keyName="tabs" title="Tabs" ui="tab">
    <string keyName="info" title="info" />
  </array>
  <array keyName="panel" ui="panel" title="Panel">
    <string keyName="info" title="info" />
  </array>
  <array keyName="tableroute" ui="tableRoute" title="Table-route" uiParams={{
    columns: [{
      title: 'info',
      dataIndex: 'info'
    }]
  }}>
    <string keyName="info" title="info" />
  </array>
  <array keyName="table" ui="table" title="Table" uiParams={{
    columns: [{
      title: 'info',
      dataIndex: 'info'
    }]
  }}>
    <string keyName="info" title="info" />
  </array>
  {/* <array keyName="slider" ui="slider" title="Slider">
    <string keyName="children" title="Children" />
  </array>
  <array keyName="tag" ui="tag" title="Tag" />
  <array keyName="gallery" ui="gallery" title="Gallery" /> */}
</object>

export default Arrays
