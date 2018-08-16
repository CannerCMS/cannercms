import { ApolloLink } from 'apollo-link';

export interface GraphqlClient {
  prepare?: (props: any) => Promise<void>;
  createLink: () => ApolloLink;
}
