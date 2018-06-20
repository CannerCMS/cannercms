/** @jsx builder */

import builder from 'canner-script';
import path from 'path';

const OnDeploy = ({attributes}) => <object {...attributes}>
  {/* <geoPoint keyName="geoPoint" title="GeoPoint" /> */}
  {/* <object keyName="variants" title="Variants" ui="variants" /> */}
  <string title="ondeploy" keyName="editor" packageName="../components/ondeploy-string-editor"/>
</object>;

export default OnDeploy;
