/** @jsx builder */
/* eslint-disable react/prop-types */

import builder from 'canner-script';

const Authors = ({attributes}) => (
  <array keyName="authors" title="Authors"
    ui="table" uiParams={{
      columns: [{
        title: 'Name',
        dataIndex: 'name'
      }]
    }}
  >
    <string keyName="name" title="Name"/>
    <image keyName="picture" title="Profile Picture"/>
    <string keyName="bio" title="Author Bio"/>
  </array>
);
export default Authors;
