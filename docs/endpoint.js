import LocalStorage from '../src/app/endpoint/localStorage';
import schema from './canner.schema.js';
const endpoint = new LocalStorage({
  schema: schema.cannerSchema
});

const endpointMap = Object.keys(schema.cannerSchema).reduce((result, key) => {
  result[key] = endpoint;
  return result;
}, {});

export default endpointMap;
