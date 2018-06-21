/** @jsx builder */

import builder from 'canner-script';

const Users = ({attributes}) => (
  <array keyName="users" title="users"
    ui="table" uiParams={{
      columns: attributes.columns
    }}
  >
    <toolbar>
      <pagination />
      <sort
        options={[{
          key: 'age',
          title: 'Age'
        }]}
        defaultSort="age"
      />
      <filter fields={[{
        label: 'Type',
        type: 'select',
        options: [{
          text: 'All',
          condition: {
          }
        }, {
          text: 'Draft',
          condition: {
            status: {
              draft: {
                eq: true
              }
            }
          }
        }, {
          text: 'Stick',
          condition: {
            status: {
              stick: {
                eq: true
              }
            }
          }
        }]
      }]} />
    </toolbar>
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
    <relation ui="multipleSelect" keyName="posts" relation={{to: 'posts', type: 'toMany'}} title="Posts" uiParams={{
      textCol: 'title',
      columns: [{
        title: 'Title',
        dataIndex: 'title'
      }]
    }} />
  </array>
);
export default Users