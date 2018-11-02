import { Connector } from './connector/types';
import { Field } from 'canner-graphql-utils/lib/schema/types';
export interface Item {
    type: string;
    items?: any;
    relation?: {
        type: string;
        to: string;
        typename: string;
    };
}
export interface CustomizeResolver {
    Fields: {
        [fieldname: string]: {
            resolve: (rootValue: any) => Promise<any>;
            create: (payload: any, schema: Field) => Promise<any>;
            update: (payload: any, schema: Field) => Promise<any>;
        };
    };
}
interface Context {
    document: any;
    connectors: Record<string, Connector>;
}
export default class Resolver {
    private resolvers;
    private fieldMap;
    constructor({ resolvers, schema }: {
        resolvers: {
            [key: string]: CustomizeResolver;
        };
        schema: {
            [key: string]: Item;
        };
    });
    listQueryById: (key: any, typename: any) => (obj: any, args: any, { document, connectors }: Context) => Promise<any>;
    listQuery: (key: any, typename: any, connection?: boolean) => (obj: any, args: any, { document, connectors }: Context) => Promise<any>;
    toOneResolver: ({ from, to, key, typename }: {
        from: string;
        to: string;
        key: string;
        typename: string;
    }) => (obj: any, args: any, { connectors }: Context) => any;
    toManyResolver: ({ from, to, key, typename, connection }: {
        from: string;
        to: string;
        key: string;
        typename: string;
        connection?: boolean;
    }) => (obj: any, args: any, { connectors }: Context) => Promise<any>;
    mapQuery: (key: string, typename: string) => (obj: any, args: any, { connectors }: Context) => Promise<any>;
    listCreateMutation: (key: string, typename: string) => (obj: any, args: any, { connectors }: Context) => Promise<any>;
    listUpdateMutation: (key: string, typename: string) => (obj: any, args: any, { connectors }: Context) => Promise<any>;
    listDeleteMutation: (key: string, typename: string) => (obj: any, args: any, { connectors }: Context) => Promise<any>;
    mapUpdateMutation: (key: string, typename: string) => (obj: any, args: any, { connectors }: Context) => Promise<any>;
    typeResolver(field: Field, modelKey: string): {};
    types(): {};
    query(): {};
    mutation(): {};
    private parseWhere;
    private parseOrder;
    private parseConnection;
    private mergeWithCustomizeFieldResolvers;
    private mergeWithCustomizeCreate;
    private mergeWithCustomizeUpdate;
    private argsToPagination;
}
export {};
