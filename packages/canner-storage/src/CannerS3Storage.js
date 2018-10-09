// @flow
import CannerStorage from './CannerStorage';

export default class CannerS3Storage extends CannerStorage {
  constructor() {
    super();
  }

  getEndpoint = () => {
    switch (process.env.NODE_ENV) {
      case 'development':
        return 'https://localhost:1234/storage/s3/uploadUrl';
      case 'development:http':
        return 'http://localhost:1234/storage/s3/uploadUrl';
      case 'production':
      default:
        return 'https://backend.canner.io/storage/s3/uploadUrl';
    }
  }
}
