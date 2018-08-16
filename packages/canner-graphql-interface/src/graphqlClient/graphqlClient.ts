import { GraphqlClient } from './types';
import { createHttpLink } from 'apollo-link-http';
import { ApolloLink } from 'apollo-link';

export default class GraphqlClientImpl implements GraphqlClient {
  private uri: string;
  private headers: any;
  private includeExtensions: boolean;
  private fetch: (uri: string, options: Object) => Promise<any>;
  private credentials: string;
  private fetchOptions: any;
  private useGETForQueries: boolean;

  constructor({
    uri,
    headers,
    fetch,
    includeExtensions,
    credentials,
    fetchOptions,
    useGETForQueries
  }: {
    uri: string,
    headers?: any,
    fetch?: any,
    includeExtensions?: boolean,
    credentials?: string,
    fetchOptions?: any,
    useGETForQueries?: boolean
  }) {
    this.uri = uri;
    this.headers = headers;
    this.fetch = fetch;
    this.includeExtensions = includeExtensions;
    this.credentials = credentials;
    this.fetchOptions = fetchOptions;
    this.useGETForQueries = useGETForQueries;
  }

  public createLink = () => {
    return createHttpLink({
      uri: this.uri,
      headers: this.headers,
      fetch: this.fetch,
      includeExtensions: this.includeExtensions,
      credentials: this.credentials,
      fetchOptions: this.fetchOptions,
      useGETForQueries: this.useGETForQueries
    });
  }
}
