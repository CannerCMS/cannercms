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
    let {path = '', value, id, relation, key} = action.payload;
    const relationField = genRelationField(schema, key);
   
    value = parseArrayToSet(value, relationField);
    
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
          update(variables.payload, path.split('/'), relationField => {
            if (isArray(relationField) || !relationField) {
              return {
                connect: [{
                  id: value.id
                }]
              };
            }
            relationField.connect.push({
              id: value.id
            });
            return relationField;
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
export function parseArrayToSet(payload: any, relationField: Array<string>, key?: string): any {
  if (isArray(payload) && relationField.indexOf(key) === -1) {
    return {
      set: payload.map(v => parseArrayToSet(v, relationField))
    };
  } else if (isPlainObject(payload)) {
    return mapValues(payload, (v, k) => parseArrayToSet(v, relationField, k));
  } else {
    return payload
  }
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