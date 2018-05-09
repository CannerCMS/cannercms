/** @jsx builder */

import builder from '@canner/canner-script';

const Users = ({attributes}) => <array keyName="users" title="users" {...attributes}>
  <string keyName="name" title="name"/>
</array>

export default Users