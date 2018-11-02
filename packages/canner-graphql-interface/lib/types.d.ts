export interface TypeResolver {
    serialize: (value: any) => any;
    parseValue: (value: any) => any;
    parseLiteral: (ast: any) => any;
}
export interface ListResolver {
    Type: {
        [key: string]: TypeResolver;
    };
    Query: {
        find: ({ document, where, order, pagination }: {
            document: any;
            where: any;
            order: any;
            pagination: any;
        }) => Promise<any>;
        findOne: ({ document, where }: {
            document: any;
            where: any;
        }) => Promise<any>;
        fields: {
            [field: string]: (value: any, document: any) => Promise<any>;
        };
    };
    Mutation: {
        create: (value: any, document: any) => Promise<any>;
        update: (value: any, document: any) => Promise<any>;
        delete: (value: any, document: any) => Promise<any>;
        fields: {
            [field: string]: (value: any, document: any) => Promise<any>;
        };
    };
}
export interface MapResolver {
    Type: {
        [key: string]: TypeResolver;
    };
    Query: {
        get: ({ document }: {
            document: any;
        }) => Promise<any>;
        fields: {
            [field: string]: (value: any, document: any) => Promise<any>;
        };
    };
    Mutation: {
        set: (value: any, document: any) => Promise<any>;
        fields: {
            [field: string]: (value: any, document: any) => Promise<any>;
        };
    };
}
export interface ResolverMap {
    [key: string]: ListResolver | MapResolver;
}
