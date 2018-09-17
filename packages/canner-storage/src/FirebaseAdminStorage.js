// @flow

import Storage from './Storage';
import type {GetUploadUrlType} from './types';

export default class FirebaseAdminStorage extends Storage {
  firebase: any;
  
  constructor({firebase, getUploadUrl}: {firebase: any, getUploadUrl: GetUploadUrlType}) {
    super({getUploadUrl});
    this.firebase = firebase;
  }
}
