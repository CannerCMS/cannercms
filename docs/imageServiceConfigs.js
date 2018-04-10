import schema from './canner.schema.js';
import {ImgurService} from '@canner/image-service-config';

const serviceConfig = new ImgurService({
  clientId: process.env.IMGUR_CLIENT_ID
});

const imageServiceConfigs = Object.keys(schema.cannerSchema).reduce((result, key) => {
  result[key] = serviceConfig;
  return result;
}, {});

export default imageServiceConfigs;
