/** @jsx builder */

import builder from '../../src';
module.exports = ({attributes, children}) => (
  <object {...attributes}>
    {children}
  </object>
);