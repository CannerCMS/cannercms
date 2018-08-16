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
import FirebaseConnector from '../src/connector/firebaseConnector';
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
    apiKey: 'AIzaSyAwzjZJD7SUCRC42mL7A9sw4VPIvodQH98',
    authDomain: 'apollo-test-2c6af.firebaseapp.com',
    databaseURL: 'https://apollo-test-2c6af.firebaseio.com',
    projectId: 'apollo-test-2c6af',
    storageBucket: '',
    messagingSenderId: '84103499922'
  });
}
describe('firebase connector', () => {
  const defaultApp = firebase.app();
  const connector = new FirebaseConnector({
    database: defaultApp.database(),
    namespace: TEST_NAMESPACE
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
    await connector.prepare();
    await defaultApp.database().ref(TEST_NAMESPACE).set(defaultDataForFirebase);
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
