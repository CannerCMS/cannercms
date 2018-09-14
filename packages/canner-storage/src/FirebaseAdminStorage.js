// @flow

import axios from 'axios';
import Promise from 'promise-polyfill';
import {getUploadPercent} from './utils';
import type {UploadOptions, OnProgressType} from './types';

type GetUploadUrlType = (
  file: File,
  filePath: string
) => Promise<{
  uploadUrl: string,
  publicUrl: string
}>;


export default class FirebaseAdminStorage {
  firebase: any;
  getUploadUrl: GetUploadUrlType;
  
  constructor({firebase, getUploadUrl}: {firebase: any, getUploadUrl: GetUploadUrlType}) {
    this.firebase = firebase;
    this.getUploadUrl = getUploadUrl;
  }

  upload(file: File, options: UploadOptions, onProgress: OnProgressType) {
    return this.getUploadUrl(file, options.filename)
      .then(data => {
        return axios
          .put(data.url, file, {
            onUploadProgress: e => (onProgress({ percent: getUploadPercent(e) })),
            headers: {
              "Content-Type": file.type,
              "X-Upload-Content-Type": file.type,
              "X-Upload-Content-Length": file.size
            }
          })
          .then(() => {
            return {
              link: data.url
            };
          });
      });
  }
}