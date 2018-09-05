/** @jsx builder */

import builder from 'canner-script';

const Posts = ({attributes}) => <array keyName="posts" ui="tableRoute" title="posts" uiParams={{
  columns: attributes.columns
}}>
  <toolbar>
    <actions filterButton/>
    <filter>
      <textFilter label="Title" field="title" />
    </filter>
    <pagination />
  </toolbar>
  <string keyName="title" title="title" />
  <array keyName="notes" title="Notes">
    <string keyName="text" title="Text" />
  </array>
  <image keyName="image" />
  <array keyName="images" ui="gallery"/>
  <relation keyName="author" title="author" relation={{type: 'toOne', to: 'users'}}
    uiParams={{
      textCol: 'name',
      columns: [{
        title: 'Name',
        dataIndex: 'name'
      }]
    }}
    ui="singleSelect"
    required
  >
  </relation>
</array>

export default Posts