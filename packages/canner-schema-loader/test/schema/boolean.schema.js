/** @jsx builder */

import builder from 'canner-script';
const Booleans = ({attributes}) => <object {...attributes}>
  <boolean keyName="card" ui="card" title="Card" />
  <boolean keyName="switch" ui="switch" title="Switch" />
</object>;

export default Booleans
