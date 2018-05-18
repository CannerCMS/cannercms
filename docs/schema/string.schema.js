/** @jsx builder */

import builder from 'canner-script';
const Strings = ({attributes}) => <object {...attributes}>
  <string keyName="input" title="Input" description="Input is the default ui of string type"/>
  <string keyName="card" title="Card" ui="card" uiParams={{
    options: [{
      text: 'YES',
      value: 'yes'
    }, {
      text: 'NO',
      value: 'no'
    }]
  }}/>
  <string keyName="editor" title="Editor" ui="editor" />
  <string keyName="link" title="Link" ui="link"/>
  <string keyName="radio" title="Radio" ui="radio" uiParams={{
    options: [{
      text: 'YES',
      value: 'yes'
    }, {
      text: 'NO',
      value: 'no'
    }]
  }}/>
  <string keyName="select" title="Select" ui="select" uiParams={{
    options: [{
      text: 'YES',
      value: 'yes'
    }, {
      text: 'NO',
      value: 'no'
    }]
  }}/>
  <string keyName="textarea" title="Textarea" ui="textarea" />
  <file keyName="image" title="Image" />
  <date keyName="date" title="Date" />
</object>;

export default Strings;
