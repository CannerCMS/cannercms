import axios from 'axios';

// @flow

export default class CannerFirebaseStorage{
  appId: ?string;
  apiToken: ?string;

  setToken = (apiToken: string) => {
    this.apiToken = apiToken;
    return this;
  }

  setAppId = (appId: string) => {
    this.appId = appId;
    return this;
  }

  getEndpoint() {
    switch (process.env.NODE_ENV) {
      case 'development':
        return '/';
      case 'production':
      default:
        return '/';
    }
  }

  getUploadUrl() {
    const endpoint = this.getEndpoint();
    return axios.get(endpoint);
  }
  
  upload(file, options, onProgress) {
    return this.getUploadUrl(file, options.filename)
      .then(({uploadUrl, publicUrl}) => {
        return axios
          .put(uploadUrl, file, {
            onUploadProgress: e => {
              const done = e.position || e.loaded;
              const total = e.totalSize || e.total;
              const percent = done / total * 100;
              onProgress({ percent });
            },
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
