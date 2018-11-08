import { GraphqlClient } from './types';
import { ApolloLink } from 'apollo-link';
export default class PrismaClient implements GraphqlClient {
    private secret;
    private appId;
    private token;
    private env;
    private rootSchema;
    prepare({ secret, appId, env, schema }: {
        secret: string;
        appId: string;
        env: string;
        schema: any;
    }): Promise<void>;
    createLink: () => ApolloLink;
    private getToken;
}
