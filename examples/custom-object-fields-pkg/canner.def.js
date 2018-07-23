/** @jsx builder */
import builder from 'canner-script';

module.exports = function({attributes}) {
  return (
    <object {...attributes}>
      <string keyName="name" />
      <string keyName="content" />
    </object>
  );
}
