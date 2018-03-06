import LocalStorage from 'provider/endpoint/localStorage';
import schema from './canner.schema.js';

export default {
  info: new LocalStorage({
    schema: schema.schema
  })
}
