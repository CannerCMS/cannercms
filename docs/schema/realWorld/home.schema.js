/** @jsx c */
import c, {Block} from 'canner-script';

export default ({attributes}) => <object keyName="home" title="Home" description="t to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of L ">
  <Block title="Basic">
    <number keyName="count" title="Count"/>
    <relation title="StaredPosts" description="Ref to Posts" keyName="staredPosts" relation={{to: 'posts', type: 'toMany'}} ui="multipleSelect" uiParams={{textCol: 'title', columns: attributes.postColumns}}/>
    <relation title="BestAuthor" description="Ref to Users" keyName="bestAuthor" relation={{to: 'users', type: 'toOne'}} uiParams={{textCol: 'name', columns: attributes.userColumns}}/>
  </Block>
  <Block title="Header">
    <object keyName="header">
      <string keyName="title" title="Title"/>
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