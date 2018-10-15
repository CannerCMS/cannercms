import CannerPlatformConnector from './cannerPlatformConnector';

export default class FirestoreAdminConnector extends CannerPlatformConnector {
  constructor({projectId}: {databaseURL: string; projectId: string}) {
    super();
    this.service = 'firebase';
    this.resourceId = projectId;
    this.connectorName = 'firestore.admin';
  }
}
