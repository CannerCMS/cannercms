/** @jsx builder */

import builder from 'canner-script';

export default <root>
  <object keyName="test">
    <string keyName="defaultUI" />
    <string keyName="withUI" ui="textarea" />
    <array keyName="withBuilder" ui="tag" />
    <array keyName="withBuilder2" ui="gallery" />
    <object keyName="withBuilder3" ui="variants" />
    <array keyName="withCannerConfigInPackageJson" ui="table" />
    <array
      keyName="uiParams"
      ui="table"
      uiParams={{
        columns: [{
          title: 'name',
          dataIndex: 'name',
        }],
      }}
    >
      <array keyName="nested">
        <string keyName="string" />
      </array>
    </array>
    <string keyName="packageName" packageName="./fake-string-component" />
  </object>
</root>;
