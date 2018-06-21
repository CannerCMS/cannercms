/* globals FIREBASE_API_KEY */

import {FirebaseClientService} from '@canner/image-service-config';
import firebase from 'firebase';
import {FirebaseRtdbClientConnector, PrismaClient} from 'canner-graphql-interface';


firebase.initializeApp({
  apiKey: FIREBASE_API_KEY,
  authDomain: "test-new-qa.firebaseapp.com",
  databaseURL: "https://test-new-qa.firebaseio.com",
  projectId: "test-new-qa",
  storageBucket: "test-new-qa.appspot.com",
  messagingSenderId: "983887338585"
});

const defaultApp = firebase.app();
const connector = new FirebaseRtdbClientConnector({
  database: defaultApp.database()
});


const storage = new FirebaseClientService({
  firebase: firebase,
  dir: "the/path/to", // specify the path you want upload to 
  filename: "filename", // rename file without extension
  hash: true, // if true, the filename will add a hash string, e.g.: `filename-${hash}.jpg`
}).getServiceConfig();

export default {
  storage,
  connector,
  graphClient: new PrismaClient()
}
