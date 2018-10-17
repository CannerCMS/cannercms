import { createLink } from './link';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { Connector } from './connector/types';
import { CustomizeResolver } from './resolver';
import { GraphqlClient } from './graphqlClient/types';
import FirebaseRtdbClientConnector from './connector/firebaseConnector';
import FirestoreClientConnector from './connector/firestoreConnector';
import FirestoreAdminConnector from './connector/firestoreAdminConnector';
import MemoryConnector from './connector/memoryConnector';
import LocalStorageConnector from './connector/localStorageConnector';
import CannerPlatformConnector from './connector/cannerPlatformConnector';
import PrismaClient from './graphqlClient/prismaClient';
import GraphqlClientImpl from './graphqlClient/graphqlClient';

class FirebaseRtdbAdminConnector extends CannerPlatformConnector {
  constructor({namespace, projectId}: {namespace?: string; databaseURL: string; projectId: string}) {
    super();
    this.service = 'firebase';
    this.resourceId = projectId;
    this.connectorName = 'firebase.rtdb.admin';
    this.connectorParams = {
      namespace
    };
  }
}

const createClient = ({
  schema,
  connector,
  connectors,
  resolvers,
  graphqlClient,
}: {
  schema: any,
  connectors?: {[key: string]: Connector};
  resolvers?: {[key: string]: CustomizeResolver};
  graphqlClient?: GraphqlClient;
  connector?: Connector;
}) => {
  const apolloCache = new InMemoryCache();
  return new ApolloClient({
    cache: apolloCache,
    link: createLink({schema, connectors, graphqlClient, connector, resolvers})
  });
};

export {
  createClient,
  MemoryConnector,
  LocalStorageConnector,
  FirebaseRtdbAdminConnector,
  FirebaseRtdbClientConnector,
  FirestoreAdminConnector,
  FirestoreClientConnector,
  PrismaClient,
  GraphqlClientImpl as GraphqlClient
};
