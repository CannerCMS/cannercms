import { GraphqlClient } from './types';
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
    createLink: () => import("apollo-link-http/node_modules/apollo-link/lib/link").ApolloLink;
    private getToken;
}
