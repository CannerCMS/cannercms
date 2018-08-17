// tslint:disable:no-unused-expression
import MemoryConnector from '../src/connector/memoryConnector';
import Resolver from '../src/resolver';
import pick from 'lodash/pick';
import { graphql } from 'graphql-anywhere/lib/async';
import gql from 'graphql-tag';
import { getMainDefinition } from 'apollo-utilities';
import { execute, makePromise, ApolloLink } from 'apollo-link';
import * as chai from 'chai';
import { createLink } from '../src/link';
import { schema } from './constants';
const expect = chai.expect;
const capitalizeFirstLetter = str => str.charAt(0).toUpperCase() + str.slice(1);
interface Result { [index: string]: any; }
import {
  queryOne, listQuery, mapQuery, listMutation, mapMutation, emptyData, caseInsensitive, defaultData
} from './testsuit';

describe('MemoryConnector', () => {
  const connector = new MemoryConnector({
    defaultData
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

  /**
   * caseInsensitive
   */
  caseInsensitive({graphqlResolve});
});
