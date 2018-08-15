/** @jsx builder */

import builder from 'canner-script';

const Users = ({attributes, children}) => <array keyName="users" title="users" {...attributes}>
  {children}
  <string keyName="name" title="name"/>
  <string keyName="email" title="Email"/>
  <number keyName="age" title="Age"/>
  <array keyName="images" title="Images">
    <string keyName="url" title="Url" />
  </array>
  <object keyName="status" title="Status">
    <boolean keyName="draft" title="Draft"/>
    <boolean keyName="stick" title="Stick"/>
  </object>
  <relation keyName="posts" relation={{to: 'posts', type: 'toMany'}} title="Posts" uiParams={{
    textCol: 'title',
    columns: [{
      title: 'Title',
      dataIndex: 'title'
    }]
  }} ui="multipleSelect"/>
</array>

export default Users