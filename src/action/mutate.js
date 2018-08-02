// @flow
import produce from 'immer';
import {merge, findIndex, remove, isArray} from 'lodash';

import type {Action, ActionType} from './types';

export default function mutate(originValue: Object, action: Action<ActionType>): any {
  let {key, id, value, path, relation} = action.payload;
  // $FlowFixMe
  return produce(originValue, draft => {
    switch (action.type) {
      case 'CREATE_ARRAY': {
        if (draft[key].edges) { // array connection
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
        if (id) {
          const index = findIndex(draft[key].edges || [], item => item.cursor === id);
          if (index === -1) {
            throw new Error(`Can't find the id in rootValue`);
          }
          const relationValue = draft[key].edges[index].node[path];
          if (!relationValue) {
            draft[key].edges[index].node[path] = [value];
          } else if (isArray(relationValue)) {
            draft[key].edges[index].node[path].push(value);
          }
        } else {
          const relationValue = draft[key][path];
          if (!relationValue) {
            draft[key][path] = [value];
          } else if (isArray(relationValue)) {
            draft[key][path].push(value);
          }
        }
        break;
      }

      case 'DISCONNECT_AND_DELETE': {
        if (id) {
          const index = findIndex(draft[key].edges || [], item => item.cursor === id);
          if (index === -1) {
            throw new Error(`Can't find the id in rootValue`);
          }
          const relationValue = draft[key].edges[index].node[path];
          if (isArray(relationValue)) {
            remove(draft[key].edges[index].node[path], item => item.id === value.id);
          }
        } else {
          const relationValue = draft[key][path];
          if (!relationValue) {
            draft[key][path] = [value];
          } else if (isArray(relationValue)) {
            remove(draft[key][path], item => item.id === value.id);
          }
        }
        break;
      }

      case 'NOOP':
      default:
        break;
    }
  });
}
