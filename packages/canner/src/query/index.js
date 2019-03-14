// @flow

import {schemaToQueriesObject, objectToQueries} from './utils';
import {mapValues, get, set, mapKeys} from 'lodash';

export class Query {
  schema: Object
  queries: Object
  variables: Object

  constructor({schema}: {schema: Object}) {
    this.schema = schema;
    const {queriesObj, variables} = schemaToQueriesObject(schema);
    this.variables = variables;
    this.queries = queriesObj;
  }

  updateQueries = (pathArr: Array<string>, field: string, value: any) => {
    const path = `${pathArr.join('.fields.')}.${field}`;
    if (field === 'args') {
      const args = get(this.queries, path) || {};
      this.variables = {...this.variables, ...Object.keys(args).reduce((result: any, key: string) => {
        result[args[key]] = value[key];

        return result;
      }, {})};
    } else {
      set(this.queries, path, value);
    }
  }

  getQueries = (pathArr: Array<string>): Object => {
    if (!pathArr || pathArr.length === 0) {
      return this.queries;
    }
    const path = pathArr.join('.fields.');
    return get(this.queries, path);
  }

  toGQL = (key?: string): string => {
    const variables = this.getVariables();
    if (key) {
      const obj = this.getQueries([key]);
      return objectToQueries({[key]: obj}, !obj.declareArgs, variables);  
    } else {
      return objectToQueries(this.queries, false, variables);
    }
  }

  getGQLMap = (): Object => {
    return Object.keys(this.schema).reduce((gqlMap, key) => {
      const customizedGql = this.schema[key].graphql;
      gqlMap[key] = customizedGql || this.toGQL(key);
      return gqlMap
    }, {});
  }

  getQueryKey = (key: string): string => {
    // return the string which includes the information of this query excluding the fields and declareArgs
    // e.g: postsConnection(first: $postsFirst,where: $postsWhere)
    const queries = this.getQueries([key]);
    delete queries.fields;
    delete queries.declareArgs;
    return objectToQueries({[key]: queries}, false)
  }

  getVariables = () => {
    return mapKeys(this.variables, (value, key) => key.substr(1));
  }

  getArgs = (path: string) => {
    const queries = this.getQueries(path.split('/')).args || {};
    const variables = this.getVariables();
    return mapValues(queries, v => variables[v.substr(1)]);
  }
}