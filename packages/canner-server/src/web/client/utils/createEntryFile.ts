import path from 'path';
import fs from 'fs';

export default function genInputFile({
  appPath,
  entryPath
}: {
  appPath: string,
  entryPath: string
}) {
  const templateCode = generateTemplate(appPath);
  fs.writeFileSync(entryPath, templateCode);
}

function toNodePath(p) {
  return p.replace(/\\/g, '/')
}

function generateTemplate(appPath) {
  return `
import React from 'react';
import ReactDOM from 'react-dom';
import App from '${toNodePath(appPath)}';
ReactDOM.render(<App />, document.getElementById('root'));
`;
}
