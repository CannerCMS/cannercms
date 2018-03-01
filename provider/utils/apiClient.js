import CannerApi from '@canner/canner-api';

class ApiClient {
  setAppId(appId) {
    this.appId = appId;
    return this;
  }

  setInitToken(initToken) {
    this.initToken = initToken;
    return this;
  }

  connect() {
    this.db = new CannerApi(this.appId, this.initToken)
      .setEndpoint(this.getEndpoint())
      .connect();
  }

  getInstance() {
    return this.db;
  }

  getEndpoint() {
    switch (process.env.NODE_ENV) {
      case 'production':
        return 'rest.canner.io';
      case 'development':
      default:
        return 'localhost:7777';
    }
  }
}

export default new ApiClient();
