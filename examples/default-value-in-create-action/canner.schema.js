/** @jsx builder */

import builder from 'canner-script';

export default (
  <root>
    <array keyName="posts" title="Posts">
      <string keyName="postId" defaultValue={() => randomString()}/>
      <number keyName="order" defaultValue={1} />
    </array>
  </root>
);

function randomString() {
  return Math.random().toString(36).substr(2, 8);
}
