/** @jsx builder */

import builder from 'canner-script';

const Posts = ({attributes}) => <array keyName="posts" ui="tableRoute" title="posts" uiParams={{
  columns: attributes.columns
}}>
  <toolbar>
    <actions filterButton importButton exportButton />
    <pagination />
    <sorter
      sort={[{
        field: 'clicks',
        label: 'Clicks'
      }]}
      defaultField="clicks"
    />
    <filter>
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
  <array keyName="notes" title="Notes">
    <string keyName="text" title="Text" />
  </array>
  <image keyName="image" />
  <array keyName="images" ui="gallery"/>
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
  </relation>
</array>

export default Posts