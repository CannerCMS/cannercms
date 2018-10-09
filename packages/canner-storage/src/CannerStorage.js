// @flow
import axios from 'axios';
import {getUploadPercent} from './utils';

export default class CannerStorage {
  env: ?string;
  appId: ?string;
  apiToken: ?string;
  getEndpoint: () => string

  setEnv = (env: string) => {
    this.env = env;
    return this;
  }

  setToken = (apiToken: string) => {
    this.apiToken = apiToken;
    return this;
  }

  setAppId = (appId: string) => {
    this.appId = appId;
    return this;
  }

  getUploadUrl(file: File, filename: string) {
    const endpoint = this.getEndpoint();
    return axios
      .post(endpoint, {
        appId: this.appId,
        env: this.env,
        contentType: file.type,
        filePath: filename
      });
  }
  
  upload(file: File, options: any, onProgress: (obj: {percent: number}) => {}) {
    return this.getUploadUrl(file, options.filename)
      .then(({uploadUrl, publicUrl}) => {
        return axios
          .put(uploadUrl, file, {
            onUploadProgress: e => (onProgress({ percent: getUploadPercent(e) })),
            headers: {
              "Content-Type": file.type,
              "X-Upload-Content-Type": file.type,
              "X-Upload-Content-Length": file.size
            }
          })
          .then(() => {
            return {url: publicUrl};
          })
      })
  }
}
