// @flow
import {Map, List, fromJS} from 'immutable';
import type {Action, ActionType} from './types';
import produce from 'immer';
import {merge, findIndex, remove} from 'lodash';

export function mutatePure(originValue: Object, action: Action<ActionType>): any {
  let {key, id, value, path, relation} = action.payload;
  value = (value && value.toJS) ? value.toJS() : value;
  // $FlowFixMe
  return produce(originValue, draft => {
    switch (action.type) {
      case 'CREATE_ARRAY': {
        if (draft[key].edges) {
          draft[key].edges.push({
            __typename: null,
            cursor: value.id,
            node: value
          });
        } else {
          draft[key].push(value);
        }
        break;
      }
      case 'UPDATE_ARRAY': {
        if (draft[key].edges) {
          draft[key].edges = draft[key].edges.map(item => {
            return item.cursor === id ?
              {
                __typename: null,
                cursor: id,
                node: merge(item.node, value)
              }:
              item
          });
        } else {
          draft[key] = draft[key].map(item => {
            return item.id === id ?
              merge(item, value) :
              item
          });
        }      
        break;
      }
      
      case 'DELETE_ARRAY': {
        if (draft[key].edges) {
          draft[key].edges = draft[key].edges.filter(item => item.cursor !== id);
        } else {
          draft[key] = draft[key].filter(item => item.id !== id);
        }
        break;
      }

      case 'UPDATE_OBJECT': {
        draft[key] = {...draft[key], ...value};
        break;
      }

      case 'CONNECT': {
        if (id) {
          // array connect
          const index = findIndex(draft[key].edges || [], item => item.cursor === id);
          value.__typename = null;
          if (relation && relation.type === 'toOne') {
            draft[key].edges[index].node[path] = value;
          } else {
            draft[key].edges[index].node[path] = draft[key].edges[index].node[path] || [];
            draft[key].edges[index].node[path].push(value);
          }
        } else {
          if (relation && relation.type === 'toOne') {
            draft[key][path] = value;
          } else {
            draft[key][path] = draft[key][path] || [];
            draft[key][path].push(value);
          }
        }
        break;
      }

      case 'DISCONNECT': {
        if (id) {
          const index = findIndex(draft[key].edges || [], item => item.cursor === id);
          if (relation && relation.type === 'toOne') {
            draft[key].edges[index].node[path] = null;
          } else {
            draft[key].edges[index].node[path] = draft[key].edges[index].node[path] || [];
            draft[key].edges[index].node[path] = draft[key].edges[index].node[path].filter(item => item.id !== value.id);
          }
        } else {
          if (relation && relation.type === 'toOne') {
            draft[key][path] = null;
          } else {
            draft[key][path] = draft[key][path] || [];
            draft[key][path] = draft[key][path].filter(item => item.id !== value.id);
          }
        }
        break;
      }

      case 'CREATE_AND_CONNECT': {
        const index = findIndex(draft[key] || [], item => item.id === id);
        draft[key][index][path].push(value);
        break;
      }

      case 'DISCONNECT_AND_DELETE': {
        const index = findIndex(draft[key] || [], item => item.id === id);
        remove(draft[key][index][path], item => item.id === id);
        break;
      }

      case 'NOOP':
      default:
        break;
    }
  });
}

export default function mutate(originValue: Map<string, *>, action: Action<ActionType>): any {
  let {key, id, value, path, relation} = action.payload;
  switch (action.type) {
    case 'CREATE_ARRAY': {
      if (originValue.hasIn([key, 'edges'])) {
        return originValue.updateIn([key, 'edges'], list => list.push(fromJS({
          cursor: value.get('id'),
          node: value
        })));
      }
      return originValue.update(key, list => list.push(value));
    }
    case 'UPDATE_ARRAY': {
      if (originValue.hasIn([key, 'edges'])) {
        return originValue.updateIn([key, 'edges'], list => list.map(item => item.get('cursor') === id ? item.mergeIn(['node'], value): item));
      }
      return originValue.update(key, list => list.map(item => item.get('id') === id ? item.merge(value): item));
    }
    
    case 'DELETE_ARRAY': {
      if (originValue.hasIn([key, 'edges'])) {
        return originValue.updateIn([key, 'edges'], list =>
          list.filter(item => item.get('cursor') !== id));
      }
      return originValue.update(key, list => list.filter(item => item.get('id') !== id));
    }

    case 'UPDATE_OBJECT': {
      return originValue.update(key, map => map.merge(value));
    }

    case 'CREATE_AND_CONNECT':
    case 'CONNECT': {
      if (id) {
        // array connect
        const index = (originValue.getIn([key, 'edges']) || new List()).findIndex(item => item.get('cursor') === id);
        if (index === -1) return originValue;
        if (relation && relation.type === 'toOne') {
          return originValue.updateIn([key, 'edges', index, 'node', path], () => value)
        } else {
          return originValue.updateIn([key, 'edges', index, 'node', path], fieldValue => {
            return (fieldValue || new List()).push(value);
          });
        }
      } else {
        if (relation && relation.type === 'toOne') {
          return originValue.updateIn([key, path], value);
        } else {
          return originValue.updateIn([key, path], fieldValue => {
            return (fieldValue || new List()).push(value);
          });
        }
      }
    }

    case 'DISCONNECT_AND_DELETE':
    case 'DISCONNECT': {
      if (id) {
        // array disconnect
        const index = (originValue.getIn([key, 'edges']) || new List()).findIndex(item => item.get('cursor') === id);
        if (index === -1) return originValue;
        if (relation && relation.type === 'toOne') {
          return originValue.updateIn([key, 'edges', index, 'node', path], () => null);
        } else {
          return originValue.updateIn([key, 'edges', index, 'node', path], fieldValue => {
            return (fieldValue || new List()).filter(item => item.get('id') !== value.get('id'));
          });
        }
      } else {
        if (relation && relation.type === 'toOne') {
          return originValue.updateIn([key, path], () => null);
        } else {
          return originValue.updateIn([key, path], fieldValue => {
            return (fieldValue || new List()).filter(item => item.get('id') !== value.get('id'));
          });
        }
      }
    }

    case 'NOOP':
    default:
      return originValue;
  }
}
