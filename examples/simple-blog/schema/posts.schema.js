/** @jsx builder */
/* eslint-disable react/prop-types */

import builder, {Focus, Default} from 'canner-script';

const Posts = ({attributes}) => <array
  keyName="posts"
  ui="tableRoute"
  title="posts"
  uiParams={{
    columns: [{
      title: 'Name',
      dataIndex: 'name'
    }]
  }}
>
  <toolbar>
    <pagination />
    <filter fields={[{
      label: 'Type',
      type: 'select',
      options: [{
        text: 'All',
        condition: {
        }
      }, {
        text: 'Published',
        condition: {
          published: {
            eq: true
          }
        }
      }, {
        text: 'Archived',
        condition: {
          archived: {
            eq: true
          }
        }
      }]
    }]} />
  </toolbar>
  <Focus focus={['name', 'content']}>
    <string keyName="name" title="Name" />
    <object keyName="content" title="Post Body" ui="editor" />
    <Default title="Basic" keyName="basic">
      <image keyName="mainImage" title="Main Image"/>
      <string keyName="summary" title="Post Summary" />
    </Default>
    <Default title="Status" keyName="status">
      <boolean keyName="published" />
      <boolean keyName="archived" />
    </Default>
    <relation keyName="author"
      ui="singleSelect"
      title="author"
      relation={{type: 'toOne', to: 'authors'}}
      uiParams={{
        textCol: 'name',
        columns: [{
          title: 'Name',
          dataIndex: 'name'
        }]
      }}
    />
    <relation keyName="Category"
      ui="singleSelect"
      title="Category"
      relation={{type: 'toOne', to: 'categories'}}
      uiParams={{
        textCol: 'name',
        columns: [{
          title: 'Name',
          dataIndex: 'name'
        }]
      }}
    />
  </Focus>
</array>;

export default Posts;

