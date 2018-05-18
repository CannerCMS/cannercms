// @flow
import type {Action, ActionType} from './types';
import pluralize from 'pluralize';
import upperFirst from 'lodash/upperFirst';
import set from 'lodash/set';

export default function actionToMutation(action: Action<ActionType>) {
  const mutation = {
    mutation: {
      args: {
        $payload: 'any',
        $where: 'any'
      },
      fields: {
        
      }
    }
  }
  const {type, payload: {key = ''}} = action;
  let name = '';
  switch(type) {
    case 'UPDATE_OBJECT':
      name = `update${upperFirst(key.toLowerCase())}`;
      break;
    case 'UPDATE_ARRAY':
      name = `update${upperFirst(pluralize.singular(key.toLowerCase()))}`;
      break;
    case 'CREATE_ARRAY':
      name = `create${upperFirst(pluralize.singular(key.toLowerCase()))}`;
      break;
    case 'DELETE_ARRAY':
      name = `delete${upperFirst(pluralize.singular(key.toLowerCase()))}`;
      break;
    default:
      name = `update${upperFirst(pluralize.singular(key.toLowerCase()))}`;
      break;
  }
  set(mutation, `mutation.fields.${name}`, {
    args: {
      data: '$payload',
      where: '$where'
    }
  });
  return mutation;
}