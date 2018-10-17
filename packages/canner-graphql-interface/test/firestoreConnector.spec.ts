// tslint:disable:no-unused-expression
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
import { execute, makePromise, ApolloLink } from 'apollo-link';
import MemoryConnector from '../src/connector/memoryConnector';
import Resolver from '../src/resolver';
import * as firebase from 'firebase';
import { schema } from './constants';
import { createLink } from '../src/link';
import { pick, mapValues, isArray, reduce, omit } from 'lodash';
import * as chai from 'chai';
import gql from 'graphql-tag';
import FirestoreConnector from '../src/connector/firestoreConnector';
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

try {
  firebase.app();
} catch (e) {
  firebase.initializeApp({
    apiKey: 'AIzaSyDbZQp686CV4Sl7d4kV7GU4-05MWlj0aqk',
    authDomain: 'canner-test-632ac.firebaseapp.com',
    databaseURL: 'https://canner-test-632ac.firebaseio.com',
    projectId: 'canner-test-632ac',
    storageBucket: '',
    messagingSenderId: '854494897315'
  });
}
describe('firestore connector', () => {
  const defaultApp = firebase.app();
  const connector = new FirestoreConnector({
    database: defaultApp.firestore()
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
    await connector.prepare();
    // clear data
    const posts = await defaultApp.firestore().collection('posts').get();
    posts.forEach(async post => {
      await defaultApp.firestore().doc(`posts/${post.id}`).delete();
    });

    const users = await defaultApp.firestore().collection('users').get();
    users.forEach(async user => {
      await defaultApp.firestore().doc(`users/${user.id}`).delete();
    });

    const cannerObjects = await defaultApp.firestore().collection('canner-object').get();
    cannerObjects.forEach(async cannerObject => {
      await defaultApp.firestore().doc(`canner-object/${cannerObject.id}`).delete();
    });
    // setup data
    await defaultApp.firestore().collection('posts').doc('1').set(defaultDataForFirebase.posts['1']);
    await defaultApp.firestore().collection('posts').doc('2').set(defaultDataForFirebase.posts['2']);
    await defaultApp.firestore().collection('users').doc('1').set(defaultDataForFirebase.users['1']);
    await defaultApp.firestore().collection('users').doc('2').set(defaultDataForFirebase.users['2']);
    await defaultApp.firestore().collection('canner-object').doc('home').set(defaultDataForFirebase.home);
  });

  after(async () => {
    // clear data
    const posts = await defaultApp.firestore().collection('posts').get();
    posts.forEach(async post => {
      await defaultApp.firestore().doc(`posts/${post.id}`).delete();
    });

    const users = await defaultApp.firestore().collection('users').get();
    users.forEach(async user => {
      await defaultApp.firestore().doc(`users/${user.id}`).delete();
    });

    const cannerObjects = await defaultApp.firestore().collection('canner-object').get();
    cannerObjects.forEach(async cannerObject => {
      await defaultApp.firestore().doc(`canner-object/${cannerObject.id}`).delete();
    });
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
