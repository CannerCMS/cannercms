import { GraphqlClient } from './types';
import { ApolloLink } from 'apollo-link';
export default class GraphqlClientImpl implements GraphqlClient {
    private uri;
    private headers;
    private includeExtensions;
    private fetch;
    private credentials;
    private fetchOptions;
    private useGETForQueries;
    constructor({ uri, headers, fetch, includeExtensions, credentials, fetchOptions, useGETForQueries }: {
        uri: string;
        headers?: any;
        fetch?: any;
        includeExtensions?: boolean;
        credentials?: string;
        fetchOptions?: any;
        useGETForQueries?: boolean;
    });
    createLink: () => ApolloLink;
}
