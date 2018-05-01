// @flow
import type {Action, ActionType} from './types';
import merge from 'lodash/merge';
import update from 'lodash/update';

export default function actionsToVariables(actions: Array<Action<ActionType>>) {
  const variables = {payload: {}};
  actions.forEach(action => {
    const {path = '', value} = action.payload;
    switch(action.type) {
      case 'CREATE_ARRAY':
      case 'UPDATE_ARRAY':
      case 'UPDATE_OBJECT':
        merge(variables.payload, value.toJS());
        break;
      case 'CONNECT':
        update(variables.payload, path.split('/').concat('connect'), arr => (arr || []).concat(value.toJS()));
        break;
      case 'CREATE_AND_CONNECT':
        update(variables.payload, path.split('/').concat('create'), arr => (arr || []).concat(value.toJS()));
        break;
      case 'DISCONNECT':
        update(variables.payload, path.split('/').concat('disconnect'), arr => (arr || []).concat(value.toJS()));
        break;
      case 'DISCONNECT_AND_DELETE':
        update(variables.payload, path.split('/').concat('disconnect'), arr => (arr || []).concat(value.toJS()));
        break;
      case 'DELETE_ARRAY':
      default:
        break;
    }
  });
  return variables;
}