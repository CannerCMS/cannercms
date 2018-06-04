// @flow
import type {Action, ActionType} from './types';
import pluralize from 'pluralize';
import upperFirst from 'lodash/upperFirst';
import set from 'lodash/set';

export default function actionToMutation(action: Action<ActionType>) {
  const mutation = {
    mutation: {
      args: {
      },
      fields: {
        
      }
    }
  }
  const {type, payload: {key = ''}} = action;
  let name = '';
  let args = {};
  let actionArgs = {};
  switch(type) {
    case 'UPDATE_OBJECT':
      args = {
        $payload: 'any'
      }
      actionArgs = {
        data: '$payload'
      }
      name = `update${upperFirst(key)}`;
      break;
    case 'UPDATE_ARRAY':
      args = {
        $payload: genUpdateInputType(action),
        $where: genWhereInputType(action)
      }
      actionArgs = {
        data: '$payload',
        where: '$where'
      }
      name = `update${upperFirst(pluralize.singular(key))}`;
      break;
    case 'CREATE_ARRAY':
      args = {
        $payload: genCreateInputType(action),
      }
      actionArgs = {
        data: '$payload',
      }
      name = `create${upperFirst(pluralize.singular(key))}`;
      break;
    case 'DELETE_ARRAY':
      args = {
        $where: genWhereInputType(action),
      }
      actionArgs = {
        where: '$where',
      }
      name = `delete${upperFirst(pluralize.singular(key))}`;
      break;
    default:
      name = `update${upperFirst(pluralize.singular(key))}`;
      break;
  }
  set(mutation, `mutation.args`, args);
  set(mutation, `mutation.fields.${name}`, {
    args: actionArgs
  });
  return mutation;
}

function genCreateInputType(action) {
  const key = action.payload.key;
  return `${KeyType(key)}CreateInput!`
}

function genUpdateInputType(action) {
  const key = action.payload.key;
  return `${KeyType(key)}UpdateInput!`;
}

function genWhereInputType(action) {
  const key = action.payload.key;
  return `${KeyType(key)}WhereUniqueInput!`;
}

function KeyType(key) {
  return upperFirst(pluralize.singular(key));
}