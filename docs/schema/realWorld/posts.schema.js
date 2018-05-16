/** @jsx builder */

import builder from '@canner/canner-script';

const Posts = ({attributes}) => <array keyName="posts" title="posts" {...attributes}>
  <string keyName="title" title="title" />
  <relation keyName="author" title="author" relation={{type: 'toMany', to: 'users'}}
    uiParams={{
      textCol: 'name'
    }}
    ui="multipleSelect"
  />
</array>

export default Posts