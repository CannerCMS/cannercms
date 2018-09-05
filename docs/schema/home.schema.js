/** @jsx c */
import c, {Block} from 'canner-script';
import {renderPosts, renderImages} from '../utils';

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

const userColumns = [{
  title: 'Name',
  dataIndex: 'name'
}, {
  title: 'Email',
  dataIndex: 'email',
}, {
  title: 'Age',
  dataIndex: 'age'
}, {
  title: 'Login',
  dataIndex: 'isLogin'
}, {
  title: 'Images',
  dataIndex: 'images',
  render: renderImages
}, {
  title: 'Hobbies',
  dataIndex: 'hobbies'
}, {
  title: 'Posts',
  dataIndex: 'posts',
  render: renderPosts
}];
const home = () => <object keyName="home" title="Home" description="t to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of L ">
  <Block title="Basic">
    <number keyName="count" title="Count"/>
    <relation ui="multipleSelect" title="StaredPosts" description="Ref to Posts" keyName="staredPosts" relation={{to: 'posts', type: 'toMany'}} uiParams={{textCol: 'title', columns: postColumns}}/>
    <relation ui="singleSelect" title="BestAuthor" description="Ref to Users" keyName="bestAuthor" relation={{to: 'users', type: 'toOne'}} uiParams={{textCol: 'name', columns: userColumns}}/>
  </Block>
  <Block title="Header">
    <object keyName="header">
      <string keyName="title" title="Title" validation={{maxLength: 4}}/>
      <string keyName="subTitle" title="Subtitle"/>
      <object keyName="desc" title="Description" ui="editor"/>
    </object>
  </Block>
  <Block title="Navs">
    <array keyName="navs">
      <string keyName="text" />
    </array>
  </Block>
</object>;

export default home;
