import path from 'path';
import fs from 'fs';

export default function createWindowVarsFile({
  schemaPath,
  windowVarsPath,
  cmsConfig,
  authPath,
}: {
  schemaPath: string,
  windowVarsPath: string,
  cmsConfig: Object,
  authPath: string,
}) {
  const templateCode = generateTemplate({
    schemaPath,
    cmsConfig,
    authPath,
  });
  fs.writeFileSync(windowVarsPath, templateCode);
}

function toNodePath(p) {
  return p.replace(/\\/g, '/')
}

function generateTemplate({
  schemaPath,
  authPath,
  cmsConfig
}) {
  return `
  import schema from '${toNodePath(schemaPath)}';
  import {getAccessToken} from '${toNodePath(authPath)}';
  window.schema = schema;
  window.cmsConfig = ${JSON.stringify(cmsConfig || {})};
  window.getAccessToken = getAccessToken;
  window.baseUrl = "/cms";
`;
}
