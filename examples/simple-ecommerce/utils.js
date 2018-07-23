// import firebase from 'firebase';
// import * as GraphQLinterface from 'canner-graphql-interface';
// import {FirebaseClientService} from '@canner/image-service-config';

// if (!firebase.apps.length) {
//   // Setup connector to connect your services
//   firebase.initializeApp(
//   // Your firebase settings.
//   );
// }
// const defaultApp = firebase.app();
// const connector = new GraphQLinterface.FirebaseRtdbClientConnector({
//   database: defaultApp.database()
// });

// const storage = new FirebaseClientService({
//   firebase,
//   dir: 'CANNER_CMS',
//   hash: true
// }).getServiceConfig();

export default {connector: {}, storage: {}};
