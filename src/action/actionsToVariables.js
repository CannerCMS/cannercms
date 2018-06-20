// @flow
import type {Action, ActionType} from './types';
import {Map, List, fromJS} from 'immutable';
import merge from 'lodash/merge';
import update from 'lodash/update';
import set from 'lodash/set';

export default function actionsToVariables(actions: Array<Action<ActionType>>, schema: Object) {
  const variables = {payload: {}, where: {}};

  actions.forEach(action => {
    let {path = '', value, id, relation, key} = action.payload;
    const relationField = genRelationField(schema, key);
   
    value = parseArrayToSet(value, relationField);
    switch(action.type) {
      case 'CREATE_ARRAY': {
        // quick fix, remove null relation, it will cause apollo break
        const ensureValue = value.filter((v, k) => v !== null && k !== '__typename' && relationField.indexOf(k) === -1);
        merge(variables.payload, (ensureValue && ensureValue.toJS) ? ensureValue.toJS() : ensureValue);
        break;
      }
      case 'UPDATE_ARRAY':
      case 'UPDATE_OBJECT':
        merge(variables.payload, (value && value.toJS) ? value.toJS() : value);
        merge(variables.where, {id});
        break;
      case 'CONNECT': {
        if (relation && relation.type === 'toMany') {
          update(variables.payload, path.split('/'), relationField => {
            if (Array.isArray(relationField) || !relationField) {
              return {
                connect: [{
                  id: value.get('id')
                }]
              };
            }
            relationField.connect.push({
              id: value.get('id')
            });
            return relationField;
          });
        } else {
          set(variables.payload, path.split('/').concat('connect'), {id: value.get('id')});
        }
        if (id) {
          merge(variables.where, {id});
        }
        break;
      }
      case 'CREATE_AND_CONNECT': {
        if (relation && relation.type === 'toMany') {
          update(variables.payload, path.split('/').concat('create'), arr => (arr || []).concat(value.toJS()));
        } else {
          set(variables.payload, path.split('/').concat('create'), value.toJS());
        }
        merge(variables.where, {id});
        break;
      }
      case 'DISCONNECT':
        if (relation && relation.type === 'toMany') {
          update(variables.payload, path.split('/').concat('disconnect'), arr => (arr || []).concat({id: value.get('id')}));
        } else {
          set(variables.payload, path.split('/').concat('disconnect'), true);
        }
        if (id) {
          merge(variables.where, {id});
        }
        break;
      case 'DISCONNECT_AND_DELETE':
        if (relation && relation.type === 'toMany') {
          update(variables.payload, path.split('/').concat('delete'), arr => (arr || []).concat(value.toJS()));
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
  return variables;
}

export function parseArrayToSet(payload: any, relationField: Array<string>, key?: string): any {
  if (List.isList(payload) && relationField.indexOf(key) === -1) {
    return fromJS({
      set: payload.map(v => parseArrayToSet(v, relationField))
    });
  } else if (Map.isMap(payload)) {
    return payload.map((v, k) => parseArrayToSet(v, relationField, k));
  } else {
    return payload
  }
}

export function genRelationField(schema: Object, key: string) {
  const keySchema = schema[key];
  let items = {};
  if (keySchema.type === 'object') {
    items = keySchema.items;
  } else {
    items = keySchema.items.items
  }

  return Object.keys(items).filter(field => items[field].type === 'relation');
}