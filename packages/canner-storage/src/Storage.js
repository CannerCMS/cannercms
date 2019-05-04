// @flow

// $FlowFixMe: Unresolved
import axios from 'axios';
import {getUploadPercent} from './utils';
import type {UploadOptions, OnProgressType, GetUploadUrlType} from './types';
export default class Storage {
  getUploadUrl: GetUploadUrlType;
  
  constructor({getUploadUrl}: {getUploadUrl: GetUploadUrlType}) {
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