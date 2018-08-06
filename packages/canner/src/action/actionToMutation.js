// @flow
import pluralize from 'pluralize';
import {upperFirst, set, isEmpty, mapValues} from 'lodash';

import type {Action, ActionType} from './types';

/**
 * change an action to mutation object which's used to generate graphql string
 */
export default function actionToMutation(action: Action<ActionType>) {
  const mutation = {
    mutation: {
      args: {
      },
      fields: {
      }
    }
  };
  const {type, payload: {key = '', id}} = action;
  let name = '';
  let args = {
    $payload: 'any',
    $where: 'any'
  };
  let actionArgs = {
    data: '$payload',
    where: '$where'
  };
  let fields = {};
  switch(type) {
    case 'UPDATE_OBJECT':
      args = {
        $payload: genUpdateInputType(action)
      }
      actionArgs = {
        data: '$payload'
      }
      name = `update${upperFirst(key)}`;
      if (action.payload.path) {
        const firstField = action.payload.path.split('/')[0];
        fields = {[firstField]: null};
      } else {
        fields = mapValues(action.payload.value, () => null);
      }
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
      name = `update${transformKey(key)}`;
      fields = {id: null};
      break;
    case 'CREATE_ARRAY':
      args = {
        $payload: genCreateInputType(action),
      }
      actionArgs = {
        data: '$payload',
      }
      name = `create${transformKey(key)}`;
      fields = {id: null};
      break;
    case 'DELETE_ARRAY':
      args = {
        $where: genWhereInputType(action),
      }
      actionArgs = {
        where: '$where',
      }
      name = `delete${transformKey(key)}`;
      fields = {id: null};
      break;
    case 'CONNECT':
    case 'DISCONNECT':
      if (id) {
        args = {
          $payload: genUpdateInputType(action),
          $where: genWhereInputType(action)
        }
        actionArgs = {
          data: '$payload',
          where: '$where'
        }
        name = `update${transformKey(key)}`;
        fields = {id: null};
      } else {
        args = {
          $payload: genUpdateInputType(action)
        }
        actionArgs = {
          data: '$payload'
        }
        name = `update${upperFirst(key)}`;
        // $FlowFixMe
        fields = {[action.payload.path]: {
          fields: {
            id: null
          }
        }};
      }
      break;
    default:
      name = `update${transformKey(key)}`;
      break;
  }
  set(mutation, `mutation.args`, args);
  set(mutation, `mutation.fields.${name}`, {
    args: actionArgs,
    fields: isEmpty(fields) ? null : fields
  });
  return mutation;
}

function genCreateInputType(action) {
  const key = action.payload.key;
  return `${transformKey(key)}CreateInput!`
}

function genUpdateInputType(action) {
  const key = action.payload.key;
  return `${transformKey(key)}UpdateInput!`;
}

function genWhereInputType(action) {
  const key = action.payload.key;
  return `${transformKey(key)}WhereUniqueInput!`;
}

export function transformKey(key: string) {
  return upperFirst(pluralize.singular(key));
}
