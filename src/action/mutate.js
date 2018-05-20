// @flow
import {Map, List, fromJS} from 'immutable';
import type {Action, ActionType} from './types';
import produce from 'immer';
import {merge, findIndex, remove} from 'lodash';

export function mutatePure(originValue: Object, action: Action<ActionType>): any {
  let {key, id, value, path} = action.payload;
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
          draft[key].deges = draft[key].edges.map(item => {
            return item.cursor === id ?
              {
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
          draft[key] = draft[key].filter(item => item.cursor !== id);
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
        if (draft[key].edges) {
          const index = findIndex(draft[key].edges || [], item => item.cursor === id);
          const relationField = draft[key].edges[index].node[path];
          value.__typename = null;
          if (relationField && relationField.edges) {
            draft[key].edges[index].node[path].edges.push({
              cursor: value.id,
              node: value,
              __typename: null,
            });
          } else {
            draft[key].edges[index].node[path] = value;
          }
          break;
        }
        const index = findIndex(draft[key] || [], item => item.id === id);
        draft[key][index][path].push(value);
        break;
      }

      case 'DISCONNECT': {
        if (draft[key].edges) {
          const index = findIndex(draft[key].edges || [], item => item.cursor === id);
          const relationField = draft[key].edges[index].node[path];
          if (relationField.edges) {
            draft[key].edges[index].node[path].edges = draft[key].edges[index].node[path].edges.filter(item => item.cursor !== value.id);
          } else {
            draft[key].edges[index].node[path] = null;
          }
          break;
        }
        const index = findIndex(draft[key] || [], item => item.id === id);
        remove(draft[key][index][path], item => item.id === id);
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
  let {key, id, value, path} = action.payload;
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

    case 'CONNECT': {
      if (originValue.hasIn([key, 'edges'])) {
        const index = (originValue.getIn([key, 'edges']) || new List()).findIndex(item => item.get('cursor') === id);
        if (index === -1) return;
        return originValue.updateIn([key, 'edges', index, 'node', path], relationField => {
          value.update('__typename', typename => typename || null);
          if (Map.isMap(relationField) && relationField.has('edges')) {
            return relationField.update('edges', list => list.push(fromJS({
              cursor: value.get('id'),
              node: value,
              __typename: null
            })));
          } else {
            return value;
          }
        });
      }      
      const index = (originValue.get(key) || new List()).findIndex(item => item.get('id') === id);
      if (index === -1) return;
      return originValue.updateIn([key, index, path], list => list.push(value));
    }

    case 'DISCONNECT': {
      if (originValue.hasIn([key, 'edges'])) {
        const index = (originValue.getIn([key, 'edges']) || new List()).findIndex(item => item.get('cursor') === id);
        if (index === -1) return;
        return originValue.updateIn([key, 'edges', index, 'node', path], relationField => {
          if (Map.isMap(relationField) && relationField.has('edges')) {
            return relationField.update('edges', list => list.filter(item => item.get('cursor') !== value.get('id')));
          } else {
            return null;
          }
        });
      }
      const index = (originValue.get(key) || new List()).findIndex(item => item.get('id') === id);
      if (index === -1) return;
      return originValue.updateIn([key, index, path], list => list.filter(item => item.get('id') !== value.get('id')));
    }

    case 'CREATE_AND_CONNECT': {
      const index = (originValue.get(key) || new List()).findIndex(item => item.get('id') === id);
      return originValue.updateIn([key, index, path], list => list.push(value));
    }

    case 'DISCONNECT_AND_DELETE': {
      const index = (originValue.get(key) || new List()).findIndex(item => item.get('id') === id);
      return originValue.updateIn([key, index, path], list => list.filter(item => item.get('id') !== value.get('id')));
    }

    case 'NOOP':
    default:
      return originValue;
  }
}
