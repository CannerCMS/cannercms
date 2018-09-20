// @flow
import produce from 'immer';
import {get, set, findIndex, remove, isArray} from 'lodash';

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
                __typename: item.__typename,
                cursor: id,
                node: {...item.node, ...value}
              }:
              item
          });
        } else {
          draft[key] = draft[key].map(item => {
            return item.id === id ?
              {...item, ...value} :
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
          // $FlowFixMe
          let relationValue = get(draft, [key, 'edges', index, 'node'].concat(path.split('/')), []);
          if (relation && relation.type === 'toOne') {
            relationValue = {...value, __typename: null};
          } else {
            if(!relationValue.find(v => v.id === value.id)) {
              relationValue.push({...value, __typename: null});
            }
          }
          // $FlowFixMe
          set(draft, [key, 'edges', index, 'node'].concat(path.split('/')), relationValue);
        } else {
          if (relation && relation.type === 'toOne') {
            // $FlowFixMe
            set(draft, [key].concat(path.split('/')), {...value, __typename: null});
          } else {
            // $FlowFixMe
            const relationValue = get(draft, [key].concat(path.split('/')), []);
            relationValue.push({...value, __typename: null});
            // $FlowFixMe
            set(draft, [key].concat(path.split('/')), relationValue);

          }
        }
        break;
      }

      case 'DISCONNECT': {
        if (id) {
          const index = findIndex(draft[key].edges || [], item => item.cursor === id);
          // $FlowFixMe
          const paths = [key, 'edges', index, 'node'].concat(path.split('/'));
          if (relation && relation.type === 'toOne') {
            set(draft, paths, null);
          } else {
            let relationValue = get(draft, paths, []);
            relationValue = relationValue.filter(item => item.id !== value.id);
            set(draft, paths, relationValue);
          }
        } else {
          // $FlowFixMe
          const paths = [key].concat(path.split('/'));
          if (relation && relation.type === 'toOne') {
            set(draft, paths, null);
          } else {
            let relationValue = get(draft, paths, []);
            relationValue = relationValue.filter(item => item.id !== value.id);
            set(draft, paths, relationValue);
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
          let relationValue = draft[key].edges[index].node[path] || [];
          if (relation && relation.type === 'toOne') {
            relationValue = {...value, __typename: null};
          } else {
            if(!relationValue.find(v => v.id === value.id)) {
              relationValue.push({...value, __typename: null});
            }
          }
          draft[key].edges[index].node[path] = relationValue;
        } else {
          if (relation && relation.type === 'toOne') {
            draft[key][path] = {...value, __typename: null};
          } else {
            draft[key][path] = draft[key][path] || [];
            draft[key][path].push({...value, __typename: null});
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
