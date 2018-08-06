// @flow

import {update, set, get} from 'lodash';
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

  isArrayAction
} from './isAction';

import type {UpdateType, Action, ActionType} from './types';


export function generateAction(arg: {
  id: string,
  updateType: UpdateType,
  value: any,
  rootValue: any,
  relation: Object
}): Action<ActionType> {
  if (isCreateArray(arg)) {
    const {key} = splitId(arg.id, arg.rootValue);
    return {
      type: 'CREATE_ARRAY',
      payload: {
        key,
        id: arg.value.id,
        value: arg.value
      }
    }
  }

  if (isCreateNestedArrayInArray(arg)) {
    const {key, id, index, paths} = splitId(arg.id, arg.rootValue);
    const item = get(arg.rootValue, [key, index]);
    update(item, paths, arr => arr.concat(arg.value));
    return {
      type: 'UPDATE_ARRAY',
      payload: {
        key,
        id,
        value: item
      }
    }
  }

  if (isCreateNestedArrayInObject(arg)) {
    const {key, id, paths} = splitId(arg.id, arg.rootValue);
    const item = get(arg.rootValue, [key]);
    update(item, paths, arr => arr ? arr.concat(arg.value) : [arg.value]);
    return {
      type: 'UPDATE_OBJECT',
      payload: {
        key,
        id,
        value: item
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
        value: arg.value,
        relation: arg.relation
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
        value: {}
      }
    }
  }

  if (isDeleteNestedArrayInArray(arg)) {
    const {key, id, index, paths} = splitId(arg.id, arg.rootValue);
    const prePaths = paths.slice(0, -1);
    const deleteIndex = paths.slice(-1)[0];
    const item = get(arg.rootValue, [key, index]);
    update(item, prePaths, arr => arr.splice(deleteIndex, 1));

    return {
      type: 'UPDATE_ARRAY',
      payload: {
        key,
        id,
        value: item
      }
    }
  }

  if (isDeleteNestedArrayInObject(arg)) {
    const {key, id, paths} = splitId(arg.id, arg.rootValue);
    const prePaths = paths.slice(0, -1);
    const deleteIndex = paths.slice(-1)[0];
    const item = get(arg.rootValue, [key]);
    update(item, prePaths, arr => arr.splice(deleteIndex, 1));

    return {
      type: 'UPDATE_OBJECT',
      payload: {
        key,
        id,
        value: item
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
        value: arg.value,
        relation: arg.relation
      }
    };
  }

  if (isUpdateArray(arg)) {
    const {key, id, paths, index} = splitId(arg.id, arg.rootValue);
    const item = get(arg.rootValue, [key, index]);
    set(item, paths, arg.value);
    return {
      type: 'UPDATE_ARRAY',
      payload: {
        key,
        id,
        value: item
      }
    };
  }

  if (isUpdateConnect(arg)) {
    /**
     * unsupport action
     */
  }

  if (isUpdateObject(arg)) {
    const {key, id, paths} = splitId(arg.id, arg.rootValue);
    const item = get(arg.rootValue, key);
    set(item, paths, arg.value);
    return {
      type: 'UPDATE_OBJECT',
      payload: {
        key,
        id,
        value: item
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
    const nestedArrPath = paths.slice(0, -1);
    const item = get(arg.rootValue, [key, index]);
    const firstIndex = firstId.split('/').slice(-1)[0];
    const secondIndex = secondId.split('/').slice(-1)[0];
    update(item, nestedArrPath, arr => {
      let newArr = arr.slice();
      newArr[firstIndex] = arr[secondIndex];
      newArr[secondIndex] = arr[firstIndex];
      return newArr;
    })

    return {
      type: 'UPDATE_ARRAY',
      payload: {
        key,
        id,
        value: item
      }
    }
  }

  if (isSwapArrayInObject(arg)) {
    const {key, id, paths} = splitId(arg.id, arg.rootValue);
    // $FlowFixMe
    const {firstId, secondId} = arg.id;
    const nestedArrPath = paths.slice(0, -1);
    const item = get(arg.rootValue, [key]);
    const firstIndex = firstId.split('/').slice(-1)[0];
    const secondIndex = secondId.split('/').slice(-1)[0];
    update(item, nestedArrPath, arr => {
      let newArr = arr.slice();
      newArr[firstIndex] = arr[secondIndex];
      newArr[secondIndex] = arr[firstIndex];
      return newArr;
    })    
    return {
      type: 'UPDATE_OBJECT',
      payload: {
        key,
        id,
        value: item
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
        value: arg.value,
        relation: arg.relation
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
       value: arg.value,
       relation: arg.relation
      }
    };
  }

  return {
    type: 'NOOP',
    payload: {
      key: '',
      value: {}
    }
  }
}

function splitId(id, rootValue) {
  if (typeof id === 'string') {
    if (isArrayAction(rootValue, id)) {
      const [key, index, ...path] = id.split('/');
      const item = rootValue[key][index];
      return {
        key,
        id: item && item.id,
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