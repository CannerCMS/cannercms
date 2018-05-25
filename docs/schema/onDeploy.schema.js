/** @jsx builder */

import builder from 'canner-script';
import path from 'path';

const OnDeploy = ({attributes}) => <object {...attributes}>
  {/* <geoPoint keyName="geoPoint" title="GeoPoint" /> */}
  {/* <object keyName="variants" title="Variants" ui="variants" /> */}
  <string keyName="editor" packageName={path.resolve(__dirname, '../components/ondeploy-string-editor')}/>
</object>;

export default OnDeploy;
