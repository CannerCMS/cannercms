// @flow

import {List} from 'immutable';
import type {UpdateType} from './types';
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

  isSwapArrayInArray,
  isSwapArrayInObject,

  isConnect,
  isDisconnect
} from './isAction';

export function generateAction(arg: {
  id: string,
  updateType: UpdateType,
  value: *,
  rootValue: any,
  relation: Object
}) {
  if (isCreateArray(arg)) {
    const {key, id, path} = splitId(arg.id, arg.rootValue);
    return {
      type: 'CREATE_ARRAY',
      payload: {
        key,
        id,
        path,
        value: arg.value
      }
    }
  }

  if (isCreateNestedArrayInArray(arg)) {
    const {key, id, path} = splitId(arg.id, arg.rootValue);
    return {
      type: 'UPDATE_ARRAY',
      payload: {
        key,
        id,
        path,
        value: arg.rootValue.getIn(arg.id.split('/')).push(arg.value)
      }
    }
  }

  if (isCreateNestedArrayInObject(arg)) {
    const {key, id, path} = splitId(arg.id, arg.rootValue);
    return {
      type: 'UPDATE_OBJECT',
      payload: {
        key,
        id,
        path,
        value: arg.rootValue.getIn(arg.id.split('/')).push(arg.value)
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
    const {key, id, path} = splitId(arg.id, arg.rootValue);
    return {
      type: 'DELETE_ARRAY',
      payload: {
        key,
        id,
        path
      }
    }
  }

  if (isDeleteNestedArrayInArray(arg)) {
    const {key, id, path} = splitId(arg.id, arg.rootValue);
    const paths = arg.id.split('/');
    return {
      type: 'UPDATE_ARRAY ',
      payload: {
        key,
        id,
        path,
        value: arg.rootValue.getIn(paths).remove(paths[1])
      }
    }
  }

  if (isDeleteNestedArrayInObject(arg)) {
    const {key, id, path} = splitId(arg.id, arg.rootValue);
    const paths = arg.id.split('/');
    return {
      type: 'UPDATE_OBJECT',
      payload: {
        key,
        id,
        path,
        value: arg.rootValue.getIn(paths).remove(paths[1])
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
    const {key, id, path} = splitId(arg.id, arg.rootValue);
    return {
      type: 'UPDATE_ARRAY',
      payload: {
        key,
        id,
        path,
        value: arg.value
      }
    };
  }

  if (isUpdateObject(arg)) {
    const {key, id, path} = splitId(arg.id, arg.rootValue);
    return {
      type: 'UPDATE_OBJECT',
      payload: {
        key,
        id,
        path,
        value: arg.value
      }
    }
  }

  if (isSwapArrayInArray(arg)) {
    const {key, id, path} = splitId(arg.id, arg.rootValue);
    // $FlowFixMe
    const {firstId, secondId} = arg.id;
    const firstIndex = firstId.split('/').slice(-1)[0];
    const secondIndex = secondId.split('/').slice(-1)[0];
    return {
      type: 'UPDATE_ARRAY',
      payload: {
        key,
        id,
        path: path.split('/').slice(0, -1).join('/'),
        value: arg.rootValue.getIn(firstId.split('/').slice(0, -1).join('/'))
          .update(list => {
            let newList = list.set(firstIndex, list.get(secondIndex));
            newList = newList.set(secondIndex, list.get(firstIndex));
            return newList;
          })
      }
    }
  }

  if (isSwapArrayInObject(arg)) {
    const {key, id, path} = splitId(arg.id, arg.rootValue);
    // $FlowFixMe
    const {firstId, secondId} = arg.id;
    const firstIndex = firstId.split('/').slice(-1)[0];
    const secondIndex = secondId.split('/').slice(-1)[0];
    return {
      type: 'UPDATE_OBJECT',
      payload: {
        key,
        id,
        path: path.split('/').slice(0, -1).join('/'),
        value: arg.rootValue.getIn(firstId.split('/').slice(0, -1).join('/'))
          .update(list => {
            let newList = list.set(firstIndex, list.get(secondIndex));
            newList = newList.set(secondIndex, list.get(firstIndex));
            return newList;
          })
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
}

function splitId(id, rootValue) {
  if (typeof id === 'string') {
    if (List.isList(rootValue)) {
      const [key, index, ...path] = id.split('/');
      const recordId = rootValue.getIn([key, index, 'id']);
      return {
        key,
        id: recordId,
        path: path.join('/')
      };
    } else {
      const [key, ...path] = id.split('/');
      return {
        key,
        path: path.join('/'),
        id
      };
    }
  }

  return splitId(id.firstId, rootValue);
}