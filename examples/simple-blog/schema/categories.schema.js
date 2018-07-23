/** @jsx builder */
/* eslint-disable react/prop-types */

import builder from 'canner-script';

const Categories = ({attributes}) => (
  <array keyName="categories" title="Categories"
    ui="table" uiParams={{
      columns: [{
        title: 'Name',
        dataIndex: 'name'
      }]
    }}
  >
    <string keyName="name" title="Name"/>
  </array>
);
export default Categories;
