/** @jsx builder */

import builder from '@canner/canner-script';

const Users = ({attributes, children}) => <array keyName="users" title="users" {...attributes}>
  {children}
  <string keyName="name" title="name"/>
  <number keyName="star" title="Title"/>
</array>

export default Users