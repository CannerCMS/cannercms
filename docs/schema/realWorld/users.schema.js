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
  <relation keyName="posts" relation={{to: 'posts', type: 'toMany'}} title="Posts" uiParams={{
    textCol: 'title'
  }}/>
</array>

export default Users