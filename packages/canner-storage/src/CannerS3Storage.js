// @flow
import CannerStorage from './CannerStorage';

export default class CannerS3Storage extends CannerStorage {
  constructor() {
    super();
  }

  getEndpoint = () => {
    switch (process.env.NODE_ENV) {
      case 'development':
        return '/storage/s3/uploadUrl';
      case 'production':
      default:
        return '/storage/s3/uploadUrl';
    }
  }
}
