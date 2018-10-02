import { GraphqlClient } from './types';
import fetch from 'isomorphic-fetch';
import { createHttpLink } from 'apollo-link-http';
import { getConfig } from '../config';
const {baseUrl} = getConfig();
const graphqlUrl = (appId: string, env: string = 'default') => `${baseUrl}/graphql/${appId}/resolve/${env}`;
const getTokenUrl = (appId: string, env: string = 'default') => `${baseUrl}/graphql/${appId}/token/${env}`;
import { ApolloLink } from 'apollo-link';

export default class PrismaClient implements GraphqlClient {
  private secret: string;
  private appId: string;
  private token: string;
  private env: string;
  private rootSchema: any;

  public async prepare({secret, appId, env, schema}: {secret: string, appId: string, env: string, schema: any}) {
    this.secret = secret;
    this.appId = appId;
    this.rootSchema = schema;
    this.env = env;
    this.token = await this.getToken();
  }

  public createLink = () => {
    return createHttpLink({
      fetch: (uri, options) => {
        const body = {
          schema: this.rootSchema,
          ...JSON.parse(options.body as string)
        };
        options.body = JSON.stringify(body);
        options.headers = {
          Authorization: `Bearer ${this.token}`,
          ...options.headers || {}
        };
        return fetch(graphqlUrl(this.appId, this.env), options);
      }
    });
  }

  private getToken = async () => {
    return fetch(getTokenUrl(this.appId, this.env), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.secret}`
      }
    })
    .then(res => {
      if (!res.ok) {
        throw new Error('unable to get token for graphql');
      }
      return res.json();
    })
    .then(data => data.token);
  }
}
