// @flow
import {update, set, merge, isPlainObject, isArray, mapValues, pickBy} from 'lodash';

import type {Action, ActionType} from './types';
import type {CannerSchema} from '../components/types';

/**
 * change actions to variables which is the argument of graphql mutation
 */
export default function actionsToVariables(actions: Array<Action<ActionType>>, schema: CannerSchema) {
  const variables = {payload: {}, where: {}};

  actions.forEach(action => {
    let {path = '', value, id, relation, key, transformGqlPayload} = action.payload;
    const relationField = genRelationField(schema, key);
    const schemaWithPath = addPath(schema[key], '');
    const jsonPath = findSchema(schemaWithPath, s => s.type === 'json')
      .map(v => v.path);
    value = parseArrayToSet(value, relationField, jsonPath, path ? `${key}/${path}` : key);
    
    switch(action.type) {
      case 'CREATE_ARRAY': {
        // remove null relation
        const ensureValue = pickBy(value, (v, k) => v !== null && relationField.indexOf(k) === -1);
        merge(variables.payload, ensureValue);
        break;
      }
      case 'UPDATE_ARRAY':
      case 'UPDATE_OBJECT': {
        merge(variables.payload, value);
        merge(variables.where, {id});
        break;
      }
      case 'CONNECT': {
        if (relation && relation.type === 'toMany') {
          update(variables.payload, path.split('/').concat('connect'), arr => {
            let connectValue = {id: value.id};
            /* transformGqlPayload is a experimental usage */
            if (transformGqlPayload) {
              connectValue = transformGqlPayload(connectValue, action);
            }
            if (!arr.concat) {
              return [connectValue];
            }
            return arr.concat(connectValue);
          });
        } else {
          set(variables.payload, path.split('/').concat('connect'), {id: value.id});
        }
        if (id) {
          merge(variables.where, {id});
        }
        break;
      }
      case 'CREATE_AND_CONNECT': {
        if (relation && relation.type === 'toMany') {
          update(variables.payload, path.split('/').concat('create'), arr => (arr || []).concat(value));
        } else {
          set(variables.payload, path.split('/').concat('create'), value);
        }
        merge(variables.where, {id});
        break;
      }
      case 'DISCONNECT':
        if (relation && relation.type === 'toMany') {
          update(variables.payload, path.split('/').concat('disconnect'), arr => (arr || []).concat({id: value.id}));
        } else {
          set(variables.payload, path.split('/').concat('disconnect'), true);
        }
        if (id) {
          merge(variables.where, {id});
        }
        break;
      case 'DISCONNECT_AND_DELETE':
        if (relation && relation.type === 'toMany') {
          update(variables.payload, path.split('/').concat('delete'), arr => (arr || []).concat(value));
        } else {
          set(variables.payload, path.split('/').concat('delete'), true);
        }
        merge(variables.where, {id});
        break;
      case 'DELETE_ARRAY':
        merge(variables.where, {id});
        break;
      default:
        break;
    }
  });
  variables.payload = removeTypename(variables.payload);
  if (isPlainObject(variables.payload)) {
    delete variables.payload.id;
  }
  return variables;
}

/**
 * add typename: null in every object
 */
export function removeTypename(payload: any): any {
  if (isPlainObject(payload)) {
    const newPayload = {...payload};
    delete newPayload.__typename;
    return mapValues(newPayload, value => removeTypename(value));
  } else if (Array.isArray(payload)) {
    return payload.map(item => removeTypename(item));
  }
  return payload;
}

export function addTypename(payload: any): any {
  if (isArray(payload)) {
    return payload.map(item => addTypename(item));
  }
  if (isPlainObject(payload)) {
    return mapValues(payload, (item, key) => {
      return key === '__typename' ?
        item :
        addTypename(item)
    });
  } else {
    return payload;
  }
}

/**
 * 
 * In canner graphql interface,
 * an array value should become a object with `set` keyword.
 * 
 * for examples:
 * origin payload = {
 *   hobbies: ['basketball', 'swim'] 
 *   name: 'James'
 * }
 * will become
 * {
 *   hobbies: {
 *     set: ['basketball', 'swim']
 *   },
 *   name: 'James'
 * } 
 *
 */
export function parseArrayToSet(payload: any, relationField: Array<string>, jsonPath: Array<string>, path: string): any {
  if (jsonPath.indexOf(path) >= 0) {
    return payload;
  }

  if (isArray(payload) && relationField.indexOf(path) === -1) {
    return {
      set: payload.map(v => parseArrayToSet(v, relationField, jsonPath, path))
    };
  } else if (isPlainObject(payload)) {
    return mapValues(payload, (v, k) => parseArrayToSet(v, relationField, jsonPath, path ? `${path}/${k}` : k));
  } else {
    return payload
  }
}

export function genJsonPath(schema: Object, key: string): any {
  const keySchema = schema[key];
  let items = {};
  if (keySchema.type === 'object') {
    items = keySchema.items;
  } else if (keySchema.type === 'array') {
    items = keySchema.items.items
  } else {
    return [];
  }

  return Object.keys(items).filter((field: string) => items[field].type === 'relation');
}

export function findSchema(schema: Object, filter: Function): Array<Object> {
  let copy = [];

  if (filter(schema)) {
    copy.push(schema);
  }
  const {items} = schema;
  if (items) {
    if (typeof items.type === 'string') {
      copy = copy.concat(findSchema(items, filter));
    } else {
      Object.keys(items).forEach(key => copy = copy.concat(findSchema(items[key], filter)));
    }
  }
  return copy;
}

export function addPath(schema: Object, path: string) {
  const {items, keyName} = schema;
  let schemaPath = path;
  if (keyName) {
    schemaPath = path ? `${path}/${keyName}` : keyName;
  }
  schema.path = schemaPath;
  if (items) {
    if (typeof items.type !== 'string') {
      Object.keys(items).forEach(key => addPath(schema.items[key], schema.path));
    } else {
      addPath(items, schema.path);
    }
  }
  return schema;
}

/**
 * find the relation field in first level relation
 */
export function genRelationField(schema: Object, key: string): Array<string> {
  const keySchema = schema[key];
  let items = {};
  if (keySchema.type === 'object') {
    items = keySchema.items;
  } else if (keySchema.type === 'array') {
    items = keySchema.items.items
  } else {
    return [];
  }

  return Object.keys(items).filter((field: string) => items[field].type === 'relation');
}