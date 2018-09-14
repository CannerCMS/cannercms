// tslint:disable:no-unused-expression
import DataLoaderConnector from '../src/connector/dataLoaderConnector';
import MemoryConnector from '../src/connector/memoryConnector';
import { execute, makePromise, ApolloLink } from 'apollo-link';
import { createLink } from '../src/link';
import { schema } from './constants';
import * as chai from 'chai';
import gql from 'graphql-tag';
import sinon from 'sinon';
const expect = chai.expect;
interface Result { [index: string]: any; }
import {
  defaultData
} from './testsuit';

describe('MemoryConnector', () => {
  const fetchCall = sinon.stub();
  const connector = new MemoryConnector({
    defaultData,
    hooks: {
      afterListResolveByUnique: (key, row) => {
        fetchCall(key, row.id);
      }
    }
  });
  const link = createLink({
    schema,
    connector
  });
  const graphqlResolve = async (query, variables?) => {
    const {data} = await makePromise<Result>(
      execute(link, {
        operationName: 'query',
        query,
        variables
      })
    );
    return data;
  };

  // it should list query users and same post id should only be called once
  it('should query users', async () => {
    const result = await graphqlResolve(gql`
      {
        users {
          id
          age
          posts {
            __typename
            id
            title
          }
          __typename
        }
      }
    `);

    expect(fetchCall.withArgs('posts', '1').calledOnce).to.be.true;
    expect(fetchCall.withArgs('posts', '2').calledOnce).to.be.true;
  });
});
