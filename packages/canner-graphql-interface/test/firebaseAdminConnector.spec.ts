// tslint:disable:no-unused-expression
import { execute, makePromise, ApolloLink } from 'apollo-link';
import MemoryConnector from '../src/connector/memoryConnector';
import Resolver from '../src/resolver';
import * as firebase from 'firebase';
import { schema } from './constants';
import { createLink } from '../src/link';
import { pick, mapValues, isArray, reduce, omit } from 'lodash';
import * as chai from 'chai';
import gql from 'graphql-tag';
import { FirebaseRtdbAdminConnector } from '../src';
const expect = chai.expect;
const TEST_NAMESPACE = '__test__';
import { queryOne, listQuery, mapQuery, listMutation, mapMutation, emptyData } from './testsuit';

const defaultData = {
  posts: [
    {id: '1', title: '123', author: '1', tags: ['node'], notes: [{text: 'note1'}, {text: 'note2'}]},
    {id: '2', title: '123', author: '2', notes: [{text: 'note3'}, {text: 'note4'}]}
  ],
  users: [
    {id: '1', age: 10, name: 'user1', email: 'wwwy3y3@gmail.com', images: [{url: 'url'}], posts: {1: true, 2: true}},
    {id: '2', age: 20, name: 'user2', email: 'wwwy3y3@gmail.com', images: [{url: 'url'}], posts: {1: true, 2: true}}
  ],
  home: {
    header: {
      title: 'largeTitle',
      subTitle: 'subTitle'
    },
    texts: ['hi', 'hi2'],
    count: 10,
    navs: [{text: 'nav1'}, {text: 'nav2'}],
    staredPosts: {1: true, 2: true},
    bestAuthor: '1'
  }
};

const defaultDataForFirebase = mapValues(defaultData, value => {
  if (isArray(value)) {
    return reduce(value, (obj: any, ele: any) => {
      obj[ele.id] = omit(ele, 'id');
      return obj;
    }, {});
  } else {
    return value;
  }
});

const anonLogin = async () => {
  return new Promise((resolve, reject) => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // User is signed in.
        resolve();
      } else {
        // User is signed out.
      }
    });

    firebase.auth().signInAnonymously().catch(error => {
      reject(error);
    });
  });
};
try {
  firebase.app();
} catch (e) {
  firebase.initializeApp({
    apiKey: 'AIzaSyAwzjZJD7SUCRC42mL7A9sw4VPIvodQH98',
    authDomain: 'apollo-test-2c6af.firebaseapp.com',
    databaseURL: 'https://apollo-test-2c6af.firebaseio.com',
    projectId: 'apollo-test-2c6af',
    storageBucket: '',
    messagingSenderId: '84103499922'
  });
}

describe('firebaseAdmin connector', () => {
  const defaultApp = firebase.app();
  const connector = new FirebaseRtdbAdminConnector({
    namespace: TEST_NAMESPACE,
    databaseURL: 'https://apollo-test-2c6af.firebaseio.com',
    projectId: 'apollo-test-2c6af'
  });
  const link = createLink({
    schema,
    connector
  });
  const graphqlResolve = async (query, variables?) => {
    const {data} = await makePromise<any>(
      execute(link, {
        operationName: 'query',
        query,
        variables
      })
    );
    return data;
  };

  before(async () => {
    // setup data
    await anonLogin();
    await defaultApp.database().ref(TEST_NAMESPACE).set(defaultDataForFirebase);
    await connector.prepare({
      // tslint:disable-next-line:max-line-length
      secret: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwZXJtaXNzaW9uIjoiYXBpIiwidiI6MSwiaWF0IjoxNTI3MDQ3MDQ4LCJleHAiOjE1Mjk2MzkwNDh9.-YU7Ykhw0rN1-Ah-jZJN4GeaKTrM3zHMGlyXTltUgh8',
      appId: '5b02829a18c84830440aace1',
      schema
    });
  });

  after(async () => {
    // await defaultApp.database().ref(TEST_NAMESPACE).remove();
    // return defaultApp.delete();
  });

  queryOne({graphqlResolve});
  listQuery({graphqlResolve});
  /**
   * Map
   */
  mapQuery({graphqlResolve});

  /**
   * mutations
   */
  listMutation({graphqlResolve});

  /**
   * Map mutations
   */
  mapMutation({graphqlResolve});

  /**
   * emptyData
   */
  emptyData({graphqlResolve});
});
