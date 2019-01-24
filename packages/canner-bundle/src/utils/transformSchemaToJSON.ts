const fs = require('fs');

export default function(schemaJsPath: string, jsonPath: string) {
  const json = require(schemaJsPath);
  const jsString = JSON.stringify(json.default.schema, null, 2);

  fs.unlinkSync(schemaJsPath);
  fs.writeFileSync(jsonPath, jsString, 'utf8');
}