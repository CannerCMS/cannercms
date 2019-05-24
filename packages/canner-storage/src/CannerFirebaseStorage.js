// @flow
import CannerStorage from './CannerStorage';

export default class CannerFirebaseStorage extends CannerStorage {
  getEndpoint = () => {
    switch (process.env.NODE_ENV) {
      case 'development':
        return 'https://localhost:1234/storage/firebase/uploadUrl';
      case 'development:http':
        return 'http://localhost:1234/storage/firebase/uploadUrl';
      case 'production':
      default:
        return 'https://backend.canner.io/storage/firebase/uploadUrl';
    }
  }
}
