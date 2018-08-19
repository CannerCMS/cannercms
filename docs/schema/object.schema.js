/** @jsx builder */

import builder from 'canner-script';
const Objects = ({attributes}) => <object {...attributes}>
  {/* <geoPoint keyName="geoPoint" title="GeoPoint" /> */}
  {/* <object keyName="variants" title="Variants" ui="variants" /> */}
  <object keyName="options" title="Options" ui="options" uiParams={{
    options: [{
      title: 'One',
      key: 'one'
    }, {
      title: 'Two',
      key: 'two'
    }],
    optionKey: 'key'
  }}>
    <string keyName="one" />
    <boolean keyName="two" />
  </object>
  <object ui="variants" keyName="variants"
    uiParams={{
      columns: [{
        title: 'Price',
        dataIndex: 'price'
      }]
    }}
  >
    <number keyName="price" title="Price"/>
  </object>
</object>;

export default Objects;
