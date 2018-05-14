import pluralize from 'pluralize';
import lowerFirst from 'lodash/lowerFirst';
import {merge} from 'lodash';

const defaultPagination = {
  first: 10
};

export function schemaToQueriesObject (schema, rootSchema, state = {}) {
  const queriesObj = {};
  const variables = {};
  rootSchema = rootSchema || {...schema};
  Object.keys(schema).map(key => {
    let rtn = {};
    const value = schema[key];
    if (isObjectType(value)) {
      const qlo = schemaToQueriesObject(value.items || {}, rootSchema);
      rtn.fields = qlo.queriesObj;
      merge(variables, qlo.variables);
    } else if (isObjectOfArray(value)) {
      const qlo = schemaToQueriesObject(value.items.items || {}, rootSchema);
      merge(variables, qlo.variables);
      rtn.fields = {
        id: null,
        ...qlo.queriesObj
      }
      if (state.firstLayer){
        rtn.isPlural = true;
      }
      const paginationKey = randomKey();
      variables[paginationKey] = defaultPagination;
      rtn.args = {
        pagination: paginationKey,
        where: randomKey(),
        orderBy: randomKey()
      };
      rtn.connection = true;
      rtn.alias = key;
    } else if (isRelationToOneType(value) && !state.inRelation) {
      const relationTo = value.relation.to;
      const qlo = schemaToQueriesObject(rootSchema[relationTo].items.items, rootSchema, {inRelation: true});
      merge(variables, qlo.variables);
      rtn.fields = {
        id: null,
        ...qlo.queriesObj
      }
      const paginationKey = randomKey();
      variables[paginationKey] = defaultPagination;
      rtn.args = {
        pagination: paginationKey,
        where: randomKey(),
        orderBy: randomKey()
      };
    } else if (isRelationToManyType(value) && !state.inRelation) {
      const relationTo = value.relation.to;
      const qlo = schemaToQueriesObject(rootSchema[relationTo].items.items, rootSchema, {inRelation: true});
      merge(variables, qlo.variables);
      rtn.fields = {
        id: null,
        ...qlo.queriesObj
      }
      const paginationKey = randomKey();
      variables[paginationKey] = defaultPagination;
      rtn.args = {
        pagination: paginationKey,
        where: randomKey(),
        orderBy: randomKey()
      };
    } else {
      rtn = null;
    }
    queriesObj[key] = rtn;
  });

  return {
    queriesObj,
    variables
  };
}

function isObjectOfArray(value) {
  return value.type === 'array' &&
    value.items &&
    value.items.type === 'object' &&
    value.items.items;
}

function isObjectType(value) {
  return value.type === 'object' &&
    value.items;
}

function isRelationToOneType(value) {
  return value.type === 'relation' &&
    value.relation.type === 'toOne';
}

function isRelationToManyType(value) {
  return value.type === 'relation' &&
    value.relation.type === 'toMany';
}

export function objectToQueries(o, close = true) {
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