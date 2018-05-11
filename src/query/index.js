// @flow

import {schemaToQueriesObject, objectToQueries} from './utils';
import {get, set} from 'lodash';

export class Query {
  schema: Object
  queries: Object

  constructor({schema}: {schema: Object}) {
    this.schema = schema;
    this.queries = schemaToQueriesObject(schema, schema, {
      firstLayer: true
    });
  }

  updateQueries = (pathArr: Array<string>, field: string, value: any) => {
    const path = `${pathArr.join('.fields.')}.${field}`;
    set(this.queries, path, value);
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
}