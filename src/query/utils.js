import pluralize from 'pluralize';
import lowerFirst from 'lodash/lowerFirst';

const defaultPagination = {
  first: 10
};

export function schemaToQueriesObject (schema, rootSchema, state = {}) {
  const queriesObj = {};
  rootSchema = rootSchema || {...schema};
  Object.keys(schema).map(key => {
    let rtn = {};
    const value = schema[key];
    if (isObjectType(value)) {
      rtn.fields = schemaToQueriesObject(value.items || {}, rootSchema);
    } else if (isObjectOfArray(value)) {
      rtn.fields = {
        id: null,
        ...schemaToQueriesObject(value.items.items, rootSchema)
      }
      if (state.firstLayer){
        rtn.isPlural = true;
      }
      rtn.args = {pagination: defaultPagination};
    } else if (isRelationToOneType(value) && !state.inRelation) {
      const relationTo = value.relation.to;
      rtn.fields = {
        id: null,
        ...schemaToQueriesObject(rootSchema[relationTo].items.items, rootSchema, {inRelation: true})
      }
      rtn.args = {pagination: defaultPagination};
    } else if (isRelationToManyType(value) && !state.inRelation) {
      const relationTo = value.relation.to;
      rtn.fields = {
        id: null,
        ...schemaToQueriesObject(rootSchema[relationTo].items.items, rootSchema, {inRelation: true})
      }
      rtn.args = {pagination: defaultPagination};
    } else {
      rtn = null;
    }
    queriesObj[key] = rtn;
  });

  return queriesObj;
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

    if (element.args) {
      const args = genArgs(element.args);
      query = `${query}(${args})`;
    }

    if (element.fields) {
      const fields = objectToQueries(element.fields);
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