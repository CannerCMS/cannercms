import CannerScript from 'canner-script';

export default (
  <root>
    <array dataSource={{ name: 'memory' }} keyName="posts" title="Posts">
      <string keyName="title" title="Title" packageName="../components/customize-string-input" />
      <string keyName="content" ui="textarea" title="Content" />
      <object keyName="info" title="Info">
        <string keyName="content" ui="textarea" title="Content" />
      </object>
      {/* <object keyName="info" title="Info"
        packageName="../components/customize-object-item"
      /> */}
    </array>
  </root>
);
