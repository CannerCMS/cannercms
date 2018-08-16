
export interface TypeResolver {
  serialize: (value) => any;
  parseValue: (value) => any;
  parseLiteral: (ast) => any;
}

export interface ListResolver {
  Type: {
    [key: string]: TypeResolver
  };
  Query: {
    find: ({document, where, order, pagination}) => Promise<any>;
    findOne: ({document, where}) => Promise<any>;
    fields: {
      [field: string]: (value, document) => Promise<any>
    };
  };
  Mutation: {
    create: (value, document) => Promise<any>;
    update: (value, document) => Promise<any>;
    delete: (value, document) => Promise<any>;
    fields: {
      [field: string]: (value, document) => Promise<any>
    };
  };
}

export interface MapResolver {
  Type: {
    [key: string]: TypeResolver
  };
  Query: {
    get: ({document}) => Promise<any>;
    fields: {
      [field: string]: (value, document) => Promise<any>
    };
  };
  Mutation: {
    set: (value, document) => Promise<any>;
    fields: {
      [field: string]: (value, document) => Promise<any>
    };
  };
}

export interface ResolverMap {
  [key: string]: ListResolver | MapResolver;
}
