// @flow

import type {UpdateType, Action, ActionType} from './types';
import {fromJS} from 'immutable';
import {
  isCreateArray,
  isCreateNestedArrayInArray,
  isCreateNestedArrayInObject,
  isCreateAndConnect,

  isDeleteArray,
  isDeleteNestedArrayInArray,
  isDeleteNestedArrayInObject,
  isDisconnectAndDelete,

  isUpdateArray,
  isUpdateObject,
  isUpdateConnect,

  isSwapRootArray,
  isSwapArrayInArray,
  isSwapArrayInObject,

  isConnect,
  isDisconnect,

  isList
} from './isAction';

export function generateAction(arg: {
  id: string,
  updateType: UpdateType,
  value: *,
  rootValue: any,
  relation: Object
}): Action<ActionType> {
  
  if (isCreateArray(arg)) {
    const {key, id} = splitId(arg.id, arg.rootValue);
    return {
      type: 'CREATE_ARRAY',
      payload: {
        key,
        id,
        value: arg.value
      }
    }
  }

  if (isCreateNestedArrayInArray(arg)) {
    const {key, id, index, paths} = splitId(arg.id, arg.rootValue);
    return {
      type: 'UPDATE_ARRAY',
      payload: {
        key,
        id,
        value: arg.rootValue.getIn([key, index])
          .updateIn(paths, list => list.push(arg.value))
          .filter((v, k) => k === paths[0])
      }
    }
  }

  if (isCreateNestedArrayInObject(arg)) {
    const {key, id, paths} = splitId(arg.id, arg.rootValue);
    return {
      type: 'UPDATE_OBJECT',
      payload: {
        key,
        id,
        value: arg.rootValue
          .get(key)
          .updateIn(paths, list => list.push(arg.value))
          .filter((v, k) => k === paths[0])
      }
    }
  }

  if (isCreateAndConnect(arg)) {
    const {key, id, path} = splitId(arg.id, arg.rootValue);
    return {
      type: 'CREATE_AND_CONNECT',
      payload: {
        key,
        id,
        path,
        value: arg.value
      }
    }
  }

  if (isDeleteArray(arg)) {
    const {key, id} = splitId(arg.id, arg.rootValue);
    return {
      type: 'DELETE_ARRAY',
      payload: {
        key,
        id,
        value: fromJS({})
      }
    }
  }

  if (isDeleteNestedArrayInArray(arg)) {
    const {key, id, index, paths} = splitId(arg.id, arg.rootValue);
    return {
      type: 'UPDATE_ARRAY',
      payload: {
        key,
        id,
        value: arg.rootValue
          .getIn([key, index])
          .updateIn(paths.slice(0, -1), list => list.delete(paths.slice(-1)[0]))
          .filter((v, k) => k === paths[0])
      }
    }
  }

  if (isDeleteNestedArrayInObject(arg)) {
    const {key, id, paths} = splitId(arg.id, arg.rootValue);
    return {
      type: 'UPDATE_OBJECT',
      payload: {
        key,
        id,
        value: arg.rootValue
          .getIn([key])
          .updateIn(paths.slice(0, -1), list => list.delete(paths.slice(-1)[0]))
          .filter((v, k) => k === paths[0])
      }
    }
  }

  if (isDisconnectAndDelete(arg)) {
    const {key, id, path} = splitId(arg.id, arg.rootValue);
    return {
      type: 'DISCONNECT_AND_DELETE',
      payload: {
        key,
        id,
        path,
        value: arg.value
      }
    };
  }

  if (isUpdateArray(arg)) {
    const {key, id, paths, index} = splitId(arg.id, arg.rootValue);
    return {
      type: 'UPDATE_ARRAY',
      payload: {
        key,
        id,
        value: arg.rootValue
          .getIn([key, index])
          .setIn(paths, arg.value)
          .filter((v, k) => k === paths[0])
      }
    };
  }

  if (isUpdateConnect(arg)) {
    const {key, id, index, paths} = splitId(arg.id, arg.rootValue);
    return {
      type: 'UPDATE_CONNECT',
      payload: {
        key,
        id,
        path: paths[0],
        value: arg.rootValue
          .getIn([key, index].concat(paths.slice(0, 2)))
          .setIn(paths.slice(2), arg.value)
          .filter((v, k) => k === paths[2])
      }
    };
  }

  if (isUpdateObject(arg)) {
    const {key, id, paths} = splitId(arg.id, arg.rootValue);
    return {
      type: 'UPDATE_OBJECT',
      payload: {
        key,
        id,
        value: arg.rootValue
          .get(key)
          .setIn(paths, arg.value)
          .filter((v, k) => k === paths[0])
      }
    };
  }

  if (isSwapRootArray(arg)) {
    /**
     * Swap root array is not allowed,
     */
  }

  if (isSwapArrayInArray(arg)) {
    const {key, id, index, paths} = splitId(arg.id, arg.rootValue);
    // $FlowFixMe
    const {firstId, secondId} = arg.id;
    const firstIndex = firstId.split('/').slice(-1)[0];
    const secondIndex = secondId.split('/').slice(-1)[0];
    return {
      type: 'UPDATE_ARRAY',
      payload: {
        key,
        id,
        value: arg.rootValue
          .getIn([key, index])
          .updateIn(paths.slice(0, -1), list => {
            let newList = list.set(firstIndex, list.get(secondIndex));
            newList = newList.set(secondIndex, list.get(firstIndex));
            return newList;
          })
          .filter((v, k) => k === paths[0])
      }
    }
  }

  if (isSwapArrayInObject(arg)) {
    const {key, id, paths} = splitId(arg.id, arg.rootValue);
    // $FlowFixMe
    const {firstId, secondId} = arg.id;
    const firstIndex = firstId.split('/').slice(-1)[0];
    const secondIndex = secondId.split('/').slice(-1)[0];
    return {
      type: 'UPDATE_OBJECT',
      payload: {
        key,
        id,
        value: arg.rootValue
          .get(key)
          .updateIn(paths.slice(0, -1), list => {
            let newList = list.set(firstIndex, list.get(secondIndex));
            newList = newList.set(secondIndex, list.get(firstIndex));
            return newList;
          })
          .filter((v, k) => k === paths[0])
      }
    }
  }

  if (isConnect(arg)) {
    const {key, id, path} = splitId(arg.id, arg.rootValue);
    return {
      type: 'CONNECT',
      payload: {
       key,
       id,
       path,
       value: arg.value 
      }
    };
  }

  if (isDisconnect(arg)) {
    const {key, id, path} = splitId(arg.id, arg.rootValue);
    return {
      type: 'DISCONNECT',
      payload: {
       key,
       id,
       path,
       value: arg.value 
      }
    };
  }

  return {
    type: 'NOOP',
    payload: {
      key: '',
      value: fromJS({})
    }
  }
}

function splitId(id, rootValue) {
  if (typeof id === 'string') {
    if (isList(rootValue, id)) {
      const [key, index, ...path] = id.split('/');
      const recordId = rootValue.getIn([key, index, 'id']);
      return {
        key,
        id: recordId,
        index,
        paths: path,
        path: path.join('/')
      };
    } else {
      const [key, ...path] = id.split('/');
      return {
        key,
        path: path.join('/'),
        paths: path,
        id: '',
        index: ''
      };
    }
  }

  return splitId(id.firstId, rootValue);
}