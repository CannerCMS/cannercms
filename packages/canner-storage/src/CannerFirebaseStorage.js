// @flow
import CannerStorage from './CannerStorage';

export default class CannerFirebaseStorage extends CannerStorage {
  constructor() {
    super();
  }

  getEndpoint = () => {
    switch (process.env.NODE_ENV) {
      case 'development':
        return '/storage/firebase/uploadUrl';
      case 'production':
      default:
        return '/storage/firebase/uploadUrl';
    }
  }
}
