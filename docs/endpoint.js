import LocalStorage from 'provider/endpoint/localStorage';
import schema from './canner.schema.js';

const endpoint = new LocalStorage({
  schema: schema.schema
});

const endpointMap = Object.keys(schema.schema).reduce((result, key) => {
  result[key] = endpoint;
  return result;
}, {});

export default endpointMap;
