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
      <sorter
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
      }]}/>
    </toolbar>
    <string keyName="name" title="name" required validation={{
      validator: (name, reject) => {
        if (name !== '123') {
          return reject('should be');
        }
      }
    }}/>
    <string keyName="email" title="Email" required validation={{format: 'email'}}/>
    <number keyName="age" title="Age" validation={{minimum: 18}}/>
    <boolean keyName="isLogin" title="Logined" />
    <array keyName="hobbies" title="Hobbies" ui="tag"
      validation={{minItems: 2}}
    />
    <array keyName="images" title="Images">
      <string keyName="url" title="Url" />
    </array>
    <object keyName="status" title="Status">
      <boolean keyName="draft" title="Draft" required/>
      <boolean keyName="stick" title="Stick"/>
    </object>
    <relation ui="multipleSelect" keyName="posts" relation={{to: 'posts', type: 'toMany'}} title="Posts" uiParams={{
      textCol: 'title',
      columns: [{
        title: 'Title',
        dataIndex: 'title'
      }]
    }}>
      {/* <toolbar /> */}
    </relation>
  </array>
);
export default Users