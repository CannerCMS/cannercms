import { ApolloClient } from 'apollo-client';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';
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
declare class FirebaseRtdbAdminConnector extends CannerPlatformConnector {
    constructor({ namespace, projectId }: {
        namespace?: string;
        databaseURL: string;
        projectId: string;
    });
}
declare const createClient: ({ schema, connector, connectors, resolvers, graphqlClient, }: {
    schema: any;
    connectors?: {
        [key: string]: Connector;
    };
    resolvers?: {
        [key: string]: CustomizeResolver;
    };
    graphqlClient?: GraphqlClient;
    connector?: Connector;
}) => ApolloClient<NormalizedCacheObject>;
export { createClient, MemoryConnector, LocalStorageConnector, FirebaseRtdbAdminConnector, FirebaseRtdbClientConnector, FirestoreAdminConnector, FirestoreClientConnector, PrismaClient, GraphqlClientImpl as GraphqlClient };
