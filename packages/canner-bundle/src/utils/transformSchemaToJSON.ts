const fs = require('fs');

export default function(schemaJsPath: string, jsonPath: string) {
  const json = require(schemaJsPath);
  const pureSchema = resolve(json.default.schema)
  const jsString = JSON.stringify(pureSchema, null, 2);

  fs.unlinkSync(schemaJsPath);
  fs.writeFileSync(jsonPath, jsString, 'utf8');
}

export function resolve(schema) {
  return mapItems(schema);
}

function mapItems(items) {
  const result = {};
  Object.keys(items).forEach(key => {
    result[key] = resolveSchema(items[key]);
  });
  return result;
}

function resolveSchema(schema) {
  const result = {...schema};
  if (schema.type === 'page' || schema.type === 'component') {
    return undefined;
  }
  if (schema.items && typeof schema.items.type !== 'string') {
    result.items = mapItems(schema.items);
  } else if (schema.items && schema.items.items) {
    result.items.items = mapItems(schema.items.items);
  }
  return result;
}