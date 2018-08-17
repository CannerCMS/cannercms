/** @jsx builder */

import builder from '../../src';
module.exports = ({attributes, children}) => (
  <object {...attributes}>
    <string keyName="d" />
    <string keyName="a" />
    {children}
  </object>
);