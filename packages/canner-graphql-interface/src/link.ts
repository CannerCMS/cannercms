import {
  ApolloLink,
  Observable,
  Operation,
  NextLink,
  FetchResult,
} from 'apollo-link';
import { ApolloCache } from 'apollo-cache';
import { Connector } from './connector/types';
import { GraphqlClient } from './graphqlClient/types';
import Resolver, { CustomizeResolver } from './resolver';
import { addTypenameToDocument, getMainDefinition } from 'apollo-utilities';
import { graphql } from 'graphql-anywhere/lib/async';
import { createSchemaForResolver } from './utils';
import mapValues from 'lodash/mapValues';

const capitalizeFirstLetter = str => str.charAt(0).toUpperCase() + str.slice(1);

export interface Args {
  cache?: ApolloCache<any>;
  schema: any;
  connectors?: {[key: string]: Connector};
  graphqlClient?: GraphqlClient;
  resolvers?: {[key: string]: CustomizeResolver};
  connector?: Connector;
}

export const createLink = (
  linkArgs: Args
) => {
  const {
    schema,
    cache,
    connectors: multiConnectors,
    connector: singleConnector,
    graphqlClient,
    resolvers: customizeResolvers
  } = linkArgs;
  if (graphqlClient) {
    return graphqlClient.createLink();
  }

  const connectors = multiConnectors || mapValues(schema, (value, key) => {
    return singleConnector;
  });

  const resolver = new Resolver({
    connectors,
    resolvers: customizeResolvers,
    schema: createSchemaForResolver(schema)
  });
  const resolvers = {
    ...resolver.types(),
    Query: resolver.query(),
    Mutation: resolver.mutation()
  };

  return new class Link extends ApolloLink {
    public request(
      operation: Operation,
      forward: NextLink
    ): Observable<FetchResult> {
      const { query } = operation;
      const type =
        capitalizeFirstLetter(
          (getMainDefinition(query) || ({} as any)).operation,
        ) || 'Query';

      const graphqlResolver = (fieldName, rootValue = {}, args, context, info) => {
        const resolverMap = resolvers[(rootValue as any).__typename || type];
        if (resolverMap) {
          const resolve = resolverMap[fieldName];
          if (resolve) {
            return resolve(rootValue, args, context, info);
          }
        }

        const fieldValue = rootValue[info.resultKey];

        if (fieldValue !== undefined) {
          return fieldValue;
        }
        return null;
      };

      const queryWithTypename = addTypenameToDocument(query);
      return new Observable(observer => {
        graphql(
          graphqlResolver,
          queryWithTypename,
          {},
          {document: queryWithTypename},
          operation.variables
        )
        .then(data => {
          observer.next({ data });
          observer.complete();
        })
        .catch(err => {
          if (err.name === 'AbortError') {
            return;
          }
          if (err.result && err.result.errors) {
            observer.next(err.result);
          }
          observer.error(err);
        });
      });
    }
  }();
};
