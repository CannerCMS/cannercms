// @flow

import Storage from './Storage';
import type {GetUploadUrlType} from './types';

export default class GoogleCloudStorage extends Storage {
  googleCloud: any;
  
  constructor({googleCloud, getUploadUrl}: {googleCloud: any, getUploadUrl: GetUploadUrlType}) {
    super({getUploadUrl});
    this.googleCloud = googleCloud;
  }
}
