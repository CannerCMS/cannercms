import { ApolloLink } from 'apollo-link';
import { ApolloCache } from 'apollo-cache';
import { Connector } from './connector/types';
import { GraphqlClient } from './graphqlClient/types';
import { CustomizeResolver } from './resolver';
export interface Args {
    cache?: ApolloCache<any>;
    schema: any;
    connectors?: {
        [key: string]: Connector;
    };
    graphqlClient?: GraphqlClient;
    resolvers?: {
        [key: string]: CustomizeResolver;
    };
    connector?: Connector;
}
export declare const createLink: (linkArgs: Args) => ApolloLink;
