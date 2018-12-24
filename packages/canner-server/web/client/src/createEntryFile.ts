import path from 'path';
import fs from 'fs';

export function genInputFile({
  schemaPath,
  appPath,
  entryPath
}: {
  schemaPath: string,
  appPath: string,
  entryPath: string
}) {
  const templateCode = generateTemplate(schemaPath, appPath);
  fs.writeFileSync(entryPath, templateCode);
}

function toNodePath(p) {
  return p.replace(/\\/g, '/')
}

function generateTemplate(schemaPath, appPath) {
  return `
import React from 'react';
import ReactDOM from 'react-dom';
// prevent path of windows
import schema from '${toNodePath(schemaPath)}';
import App from '${toNodePath(appPath)}';
import "antd/dist/antd.less";
window.schema = schema;
ReactDOM.render(<App />, document.getElementById('root'));
`;
}
