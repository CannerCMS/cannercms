// @flow

import {schemaToQueriesObject, objectToQueries} from './utils';
import {merge, get, set} from 'lodash';

export class Query {
  schema: Object
  queries: Object
  variables: Object

  constructor({schema}: {schema: Object}) {
    this.schema = schema;
    const {queriesObj, variables} = schemaToQueriesObject(schema, schema, {
      firstLayer: true
    });
    this.variables = variables;
    this.queries = queriesObj;
  }

  updateQueries = (pathArr: Array<string>, field: string, value: any) => {
    const path = `${pathArr.join('.fields.')}.${field}`;
    if (field === 'args') {
      const args = get(this.queries, path);
      merge(this.variables, Object.keys(args).reduce((result, key) => {
        result[args[key]] = value[key];
        return result;
      }, {}));
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
    if (key) {
      const obj = this.getQueries([key]);
      return objectToQueries({[key]: obj});  
    } else {
      return objectToQueries(this.queries);
    }
  }

  getVairables = () => {
    return this.variables;
  }
}