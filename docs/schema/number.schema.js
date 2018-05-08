/** @jsx builder */

import builder from '@canner/canner-script';
const Numbers = ({attributes}) => <object {...attributes}>
  <number keyName="input" title="Title" ui="input" />
  <number keyName="rate" title="Rate" ui="rate" />
  <number keyName="slider" title="Slider" ui="slider" />
</object>;

export default Numbers;