/** @jsx builder */

import builder from 'canner-script';

const Posts = ({attributes}) => <array keyName="posts" title="posts" {...attributes}>
  <string keyName="title" title="title" />
  <array keyName="notes" title="Notes">
    <string keyName="text" title="Text" />
  </array>
  <relation keyName="author" title="author" relation={{type: 'toOne', to: 'users'}}
    uiParams={{
      textCol: 'name',
      columns: [{
        title: 'Name',
        dataIndex: 'name'
      }]
    }}
    ui="singleSelect"
  />
</array>

module.exports = Posts