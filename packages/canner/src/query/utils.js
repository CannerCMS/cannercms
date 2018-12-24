// @flow

import pluralize from 'pluralize';
import lowerFirst from 'lodash/lowerFirst';
import upperFirst from 'lodash/upperFirst';
import {merge, mapValues, set} from 'lodash';
import {createSchema} from './schema/utils';
import {types, Field} from './schema/types';

const DEFAULT_FIRST = 10;
const MAX = undefined;

export function fieldToQueriesObject(field: any): any {
  let queriesObj = {};
  const variables = {};
  let variableTypes = {};
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
        const qlo = fieldToQueriesObject(childField);
        set(queriesObj, ['fields', childField.getKey()], qlo.queriesObj);
        merge(variables, qlo.variables);
        merge(variableTypes, qlo.variableTypes);
      });
      if (field.isEntity) {
        const {args, firstKey, afterKey, lastKey, beforeKey, whereKey, orderByKey} = genQuery(field);
        queriesObj.declareArgs = {
          ...variableTypes,
          [firstKey]: 'Int',
          [afterKey]: 'String',
          [lastKey]: 'Int',
          [beforeKey]: 'String',
          [whereKey]: `${typeKey(field.getKey())}WhereInput`,
          [orderByKey]: `${typeKey(field.getKey())}OrderByInput`
        };
        queriesObj.connection = true;
        queriesObj.args = args;
        queriesObj.isPlural = true;
        queriesObj.alias = field.getKey();
        set(queriesObj, ['fields', 'id'], null);
        variables[firstKey] = MAX;
        variables[whereKey] = {};
        const toolbar = field.getAttr('toolbar');
        const asyncToolbar = toolbar && toolbar.async;
        const defaultSortField = toolbar && toolbar.sorter && toolbar.sorter.defaultField;
        const permanentFilter = toolbar && toolbar.filter && toolbar.filter.permanentFilter;
        const defaultFilter = toolbar && toolbar.filter && toolbar.filter.defaultFilter;
        if (asyncToolbar) {
          variables[firstKey] = DEFAULT_FIRST;
          if (permanentFilter) {
            variables[whereKey] = permanentFilter;
          }

          if (defaultFilter) {
            variables[whereKey] = defaultFilter;
          }

          if (defaultSortField) {
            const field = (toolbar.sorter.options || []).find(option => option.field === defaultSortField);
            const defaultOrder = field && field.defaultOrder ? field.defaultOrder.toUpperCase() : 'ASC';
            variables[orderByKey] = `${defaultSortField}_${defaultOrder}`
          }
        }
      }
      break;
    }

    case types.RELATION: {
      set(queriesObj, ['fields', 'id'], null);
      const relationFields = field.getRelationFields();
      field.forEach(childField => {
        if (relationFields.includes(childField.getKey()) || (relationFields.length === 0 && childField.getType() !== types.RELATION)) {
          const qlo = fieldToQueriesObject(childField);
          set(queriesObj, ['fields', childField.getKey()], qlo.queriesObj);
          merge(variables, qlo.variables);
          merge(variableTypes, qlo.variableTypes);
        }
      });
      // for now, fetch all toMany data
      // if (field.isToMany()) {
      //   const {args, firstKey, afterKey, lastKey, beforeKey, whereKey, orderByKey} = genQuery();
      //   queriesObj.args = args;
      //   queriesObj.isPlural = true;
      //   variables[firstKey] = defaultFirst;
      //   variableTypes = {
      //     ...variableTypes,
      //     [firstKey]: 'Int',
      //     [afterKey]: 'String',
      //     [lastKey]: 'Int',
      //     [beforeKey]: 'String',
      //     [whereKey]: `${typeKey(field.relationTo())}WhereUniqueInput`,
      //     [orderByKey]: `${typeKey(field.relationTo())}WhereUniqueInput`
      //   }
      // }
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
    case types.COMPONENT:
      queriesObj = undefined;
      break;
    case types.BOOLEAN:
    case types.NUMBER:
    case types.INT:
    case types.ID:
    case types.STRING:
    case types.JSON:
    default:
      queriesObj = null;
      break;
  }
  return {
    queriesObj,
    variables,
    variableTypes
  };
}

export function genQuery(field: Field) {
  const key = field.getKey();
  const firstKey = `$${key}First`;
  const afterKey = `$${key}After`;
  const lastKey = `$${key}Last`;
  const beforeKey = `$${key}Before`;
  const whereKey = `$${key}Where`;
  const orderByKey = `$${key}OrderBy`;
  const args = {
    first: firstKey,
    after: afterKey,
    last: lastKey,
    before: beforeKey,
    where: whereKey,
    orderBy: orderByKey
  };
  return {args, firstKey, afterKey, lastKey, beforeKey, whereKey, orderByKey};
}

export function schemaToQueriesObject(schema: any) {
  const rootFields = createSchema(schema);
  const rootVariables = {};
  let rootVariableTypes = {};
  const queriesObj = mapValues(rootFields, (v, key) => {
    const {variables, queriesObj, variableTypes} = fieldToQueriesObject(v);
    merge(rootVariables, variables);
    rootVariableTypes[key] = variableTypes;
    return queriesObj;
  });

  return {
    queriesObj,
    variables: rootVariables
  }
}

export function objectToQueries(o: Object, close: boolean = true, variables?: Object) {

  const result = Object.keys(o).map(key => {
    let query = `${key}`;
    let element = o[key];
    if (element === null) {
      return `${query}`;
    } else if (!element) {
      return '';
    }

    if (element.declareArgs) {
      const originElement = {...element};
      const args = originElement.declareArgs;
      delete originElement.declareArgs;
      query = 'query';
      element = {
        args,
        fields: {
          [key]: originElement
        }
      };
      key = 'query';
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
      if (key === 'query') {
        const args = genDeclareArgs(element.args, variables);
        query = args ? `${query}(${args})` : `${query}`;
      } else {
        const args = genArgs(element.args, variables);
        query = args ? `${query}(${args})` : `${query}`;
      }
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
              hasNextPage: null,
              hasPreviousPage: null
            }
          }
        }
      }
      fields = objectToQueries(fields, true, variables);
      
      query = `${query}${fields}`;
    }
    return `${query}`;
  }).join(' ');
  return close ? `{${result}}` : result;
}

function genArgs(args, variables) {
  return Object.keys(args)
    .filter(key => {
      if (variables && variables[args[key].substr(1)] === undefined) {
        return false;
      }
      return true;
    })
    .map(key => {
      const argValue = args[key];
      return `${key}: ${argValue}`
    }).join(',');
}

function genDeclareArgs(args, variables) {
  return Object.keys(args)
    .filter(key => {
      if (variables && variables[key.substr(1)] === undefined) {
        return false;
      }
      return true;
    })
    .map(key => {
      const argValue = args[key];
      return `${key}: ${argValue}`
    }).join(',');
}

function typeKey(key) {
  return upperFirst(pluralize.singular(key));
}
