import { GraphqlClient } from './types';
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
    createLink: () => import("apollo-link-http/node_modules/apollo-link/lib/link").ApolloLink;
}
