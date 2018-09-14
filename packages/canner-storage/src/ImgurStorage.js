// @flow

import axios from 'axios';
import {getUploadPercent} from './utils';
import type {UploadOptions, OnProgressType} from './types';

const IMGUR_IMAGE_API = 'https://api.imgur.com/3/image/';

export default class ImgurStorage {
  clientId: string;
  mashapeKey: string;
  
  constructor({clientId = '', mashapeKey = ''}: {clientId: string, mashapeKey?: string}) {
    this.clientId = clientId;
    this.mashapeKey = mashapeKey;
  }

  getUploadUrl() {
    return {
      url: IMGUR_IMAGE_API
    };
  }

  upload(file: File, options: UploadOptions, onProgress: OnProgressType) {
    const headers: any = {
      Authorization: `Client-ID ${this.clientId}`,
      "X-Requested-With": null // https://github.com/react-component/upload/issues/33
    };
    
    if (this.mashapeKey) {
      headers['X-Mashape-Key'] = this.mashapeKey;
    }

    const form = new FormData();
    form.append('image', file);
    form.append('name', options.filename);

    return axios
      .post(IMGUR_IMAGE_API, form, {
        headers,
        onUploadProgress: e => (onProgress({ percent: getUploadPercent(e) }))
      })
      .then(({link}) => {
        return {
          link
        };
      });
  }
}