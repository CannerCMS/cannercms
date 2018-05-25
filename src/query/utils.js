// @flow

import pluralize from 'pluralize';
import lowerFirst from 'lodash/lowerFirst';
import {merge, mapValues, set} from 'lodash';
import {createSchema} from './schema/utils';
import {types} from './schema/types';

const defaultPagination = {
  first: 10
};

export function fieldToQueriesObject(field: any): any {
  let queriesObj = {};
  const variables = {};
  const type = field.getType();
  switch (type) {
    case types.OBJECT: {
      field.forEach(childField => {
        const qlo = fieldToQueriesObject(childField);
        set(queriesObj, ['fields', childField.getKey()], qlo.queriesObj);
      });
      break;
    }
    case types.ARRAY: {
      field.forEach(childField => {
        set(queriesObj, ['fields', 'id'], null);
        const qlo = fieldToQueriesObject(childField);
        set(queriesObj, ['fields', childField.getKey()], qlo.queriesObj);
        merge(variables, qlo.variables);
      });
      if (field.isEntity) {
        const {args, paginationKey} = genQuery();
        queriesObj.args = args;
        queriesObj.isPlural = true;
        queriesObj.connection = true;
        queriesObj.alias = field.getKey();
        variables[paginationKey] = defaultPagination;
      }
      break;
    }

    case types.RELATION: {
      set(queriesObj, ['fields', 'id'], null);
      field.forEach(childField => {
        if (childField.getType() !== types.RELATION) {
          const qlo = fieldToQueriesObject(childField);
          set(queriesObj, ['fields', childField.getKey()], qlo.queriesObj);
          merge(variables, qlo.variables);
        }
      });
      if (field.isToMany()) {
        const {args, paginationKey} = genQuery();
        queriesObj.args = args;
        queriesObj.isPlural = true;
        queriesObj.connection = true;
        queriesObj.alias = field.getKey();
        variables[paginationKey] = defaultPagination;
      }
      break;
    }

    case types.DATETIME:
    case types.FILE:
    case types.GEOPOINT:
    case types.IMAGE: {
      field.forEach(childField => {
        const qlo = fieldToQueriesObject(childField);
        set(queriesObj, ['fields', childField.getKey()], qlo.queriesObj);
      });
      break;
    }
    case types.BOOLEAN:
    case types.NUMBER:
    case types.INT:
    case types.ID:
    case types.STRING:
    default:
      queriesObj = null;
      break;
  }
  return {
    queriesObj,
    variables
  };
}

export function genQuery() {
  const paginationKey = randomKey();
  const args = {
    pagination: paginationKey,
    where: randomKey(),
    orderBy: randomKey()
  };
  return {args, paginationKey};
}

export function schemaToQueriesObject(schema: any) {
  const rootFields = createSchema(schema);
  const rootVariables = {};
  const queriesObj = mapValues(rootFields, v => {
    const {variables, queriesObj} = fieldToQueriesObject(v);
    merge(rootVariables, variables);
    return queriesObj;
  });

  return {
    queriesObj,
    variables: rootVariables
  }
}

export function objectToQueries(o: Object, close: boolean = true) {
  const result = Object.keys(o).map(key => {
    let query = `${key}`;
    const element = o[key];
    if (!element) {
      return `${query}`;
    }

    if (element.isPlural) {
      query = pluralize.plural(lowerFirst(query));
    }

    if (element.connection) {
      query = `${query}Connection`;
    }

    if (element.alias) {
      query = `${element.alias}: ${query}`;
    }

    if (element.args) {
      const args = genArgs(element.args);
      query = `${query}(${args})`;
    }

    if (element.fields) {
      let {fields} = element;
      if (element.connection) {
        fields = {
          edges: {
            fields: {
              cursor: null,
              node: {
                fields
              }
            }
          },
          pageInfo: {
            fields: {
              hasNextPage: null
            }
          }
        }
      }
      fields = objectToQueries(fields);
      
      query = `${query}${fields}`;
    }
    return `${query}`;
  }).join(' ');
  return close ? `{${result}}` : result;
}

function genArgs(args) {
  return Object.keys(args).map(key => {
    let argValue = args[key];
    if (typeof argValue === 'object') {
      argValue = JSON.stringify(argValue).replace(/"([^(")"]+)":/g, "$1:");
    } else if (typeof argValue !== 'string') {
      argValue = `"${argValue}"`
    }
    return `${key}: ${argValue}`
  }).join(',');
}

function randomKey () {
  if (process.env.NODE_ENV === 'test') {
    return `$RANDOM_KEY`;
  }
  return `$KEY${Math.random().toString(36).substr(2, 7)}`
}