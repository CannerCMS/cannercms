// @flow

export default class CannerS3Storage{
  appId: string;
  
  constructor({appId}: {appId: string}) {
    this.appId = appId;
  }
}
