import path from 'path';
import fs from 'fs';

export default function createWindowVarsFile({
  schemaPath,
  windowVarsPath,
  cloudPath,
  authPath,
  graphqlPort
}: {
  schemaPath: string,
  windowVarsPath: string,
  cloudPath: string,
  authPath: string,
  graphqlPort: number
}) {
  const templateCode = generateTemplate({
    schemaPath,
    cloudPath,
    authPath,
    graphqlPort
  });
  fs.writeFileSync(windowVarsPath, templateCode);
}

function toNodePath(p) {
  return p.replace(/\\/g, '/')
}

function generateTemplate({
  schemaPath,
  cloudPath,
  authPath,
  graphqlPort
}) {
  return `
  import schema from '${toNodePath(schemaPath)}';
  import cloudConfig from '${toNodePath(cloudPath)}';
  import {getAccessToken} from '${toNodePath(authPath)}';
  window.schema = schema;
  window.cloudConfig = cloudConfig;
  window.getAccessToken = getAccessToken;
  window.baseUrl = "/cms";
  window.graphqlPort = ${graphqlPort};
`;
}
