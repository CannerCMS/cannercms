/** @jsx builder */

import builder from 'canner-script';

const postColumns = [{
  title: 'Title',
  dataIndex: 'title',
  sorter: (a, b) => a.title > b.title
}, {
  title: 'User',
  dataIndex: 'author.name',
  sorter: (a, b) => a.author.name > b.author.name
}, {
  title: 'Clicks',
  dataIndex: 'clicks'
}];

const Posts = () => <array keyName="posts" ui="tableRoute" title="posts" uiParams={{
  columns: postColumns
}}>
  <toolbar>
    <actions filterButton importButton exportButton />
    <pagination />
    <sorter
      options={[{
        field: 'clicks',
        label: 'Clicks',
        defaultOrder: 'DESC'
      }]}
      defaultField="clicks"
    />
    <filter permanentFilter={{title: {contains: 'd'}}}>
      <textFilter label="title" field="title"/>
      <textFilter label="Author Name" field="author.name"/>
      <selectFilter label="Author Name" options={[{
        text: '123',
        condition: {
          author: {
            name: {
              eq: '123'
            }
          }
        }
      }, {
        text: 'All',
        condition: {
        }
      }]}/>
    </filter>
  </toolbar>
  <string keyName="title" title="title" />
  <number keyName="clicks" title="Clicks" />
  <json keyName="variants" ui="variants" title="Clicks" >
    <string keyName="title" />
  </json>
  <array keyName="notes" title="Notes">
    <string keyName="text" title="Text" />
  </array>
  <image keyName="image" />
  <array keyName="images" ui="gallery"/>
  <object keyName="test" title="testes">
  <relation ui="singleSelectTree" keyName="categories" title="Categories" relation={{type: 'toOne', to: 'selfRelation'}}
    uiParams={{
      textCol: 'name',
      columns: [{
        title: 'Name',
        dataIndex: 'name'
      }],
      relationField: 'toOneSelfRelation'
    }}
  >
    <toolbar>
    </toolbar>
  </relation>
  </object>
  <relation keyName="author" title="author" relation={{type: 'toOne', to: 'users'}}
    uiParams={{
      textCol: 'name',
      columns: [{
        title: 'Name',
        dataIndex: 'name'
      }]
    }}
    ui="singleSelect"
    required
  >
    <toolbar>
      <actions filterButton importButton exportButton />
      <pagination />
      <sorter
        sort={[{
          field: 'age',
          label: 'Age'
        }]}
        defaultField="age"
      />
      <filter permanentFilter={{name: {eq: 'hi'}}}>
        <textFilter label="Name" field="name"/>
        <numberFilter label="Age" field="age"/>
        <selectFilter label="Status" options={[{
          text: 'Draft',
          condition: {
            status: {
              draft: {
                eq: true
              }
            }
          }
        }, {
          text: 'All',
          condition: {
          }
        }]}/>
      </filter>
    </toolbar>
  </relation>
</array>

export default Posts