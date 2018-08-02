
import {isArray, isPlainObject} from 'lodash';

/**
|--------------------------------------------------
| create
|--------------------------------------------------
*/
export function isCreateArray({id, updateType, rootValue, relation}) {
  return idLength(id) === 1 &&
    updateType === 'create' &&
    isArrayAction(rootValue, id) &&
    !relation;
}

export function isCreateNestedArrayInArray({id, updateType, rootValue, relation}) {
  return idLength(id) > 2 && 
    updateType === 'create' &&
    isArrayAction(rootValue, id) &&
    !relation;
}

export function isCreateNestedArrayInObject({id, updateType, rootValue, relation}) {
  return idLength(id) > 1 &&
    updateType === 'create' &&
    isObjectAction(rootValue, id) &&
    !relation;
}

export function isCreateAndConnect({id, updateType, relation}) {
  return idLength(id) > 2 &&
    updateType === 'create' &&
    relation;
}

/**
|--------------------------------------------------
| delete
|--------------------------------------------------
*/
export function isDeleteArray({id, updateType, rootValue, relation}) {
  return idLength(id) === 2 &&
    updateType === 'delete' &&
    isArrayAction(rootValue, id) &&
    !relation;
}

export function isDeleteNestedArrayInArray({id, updateType, rootValue, relation}) {
  return idLength(id) > 2 &&
    updateType === 'delete' &&
    isArrayAction(rootValue, id) &&
    !relation;
}

export function isDeleteNestedArrayInObject({id, updateType, rootValue, relation}) {
  return idLength(id) > 1 &&
    updateType === 'delete' &&
    isObjectAction(rootValue, id) &&
    !relation;
}

export function isDisconnectAndDelete({id, updateType, relation}) {
  return idLength(id) > 1 &&
    updateType === 'delete' &&
    relation;
}

/**
|--------------------------------------------------
| update
|--------------------------------------------------
*/
export function isUpdateArray({id, updateType, rootValue, relation}) {
  return idLength(id) >= 2 &&
    updateType === 'update' &&
    isArrayAction(rootValue, id) &&
    !relation;
}

export function isUpdateObject({id, updateType, rootValue, relation}) {
  return idLength(id) >= 1 &&
    updateType === 'update' &&
    isObjectAction(rootValue, id) &&
    !relation;
}

export function isUpdateConnect({id, updateType, rootValue, relation}) {
  return idLength(id) >= 4 &&
    updateType === 'update' &&
    isArrayAction(rootValue, id) &&
    relation;
}

/**
|--------------------------------------------------
| swap
|--------------------------------------------------
*/
export function isSwapRootArray({id, updateType, rootValue, relation}) {
  return updateType === 'swap' &&
    typeof id === 'object' &&
    idLength(id.firstId) === 2 &&
    isArrayAction(rootValue, id.firstId) &&
    !relation;
}

export function isSwapArrayInArray({id, updateType, rootValue, relation}) {
  return updateType === 'swap' &&
    typeof id === 'object' &&
    idLength(id.firstId) > 2 &&
    isArrayAction(rootValue, id.firstId) &&
    !relation;
}

export function isSwapArrayInObject({id, updateType, rootValue, relation}) {
  return updateType === 'swap' &&
    typeof id === 'object' &&
    idLength(id.firstId) > 1 &&
    isObjectAction(rootValue, id.firstId) &&
    !relation;
}

/**
|--------------------------------------------------
| connect
|--------------------------------------------------
*/
export function isConnect({id, updateType, relation}) {
  return idLength(id) > 1 &&
    updateType === 'connect' &&
    relation;
}

/**
|--------------------------------------------------
| disconnect
|--------------------------------------------------
*/
export function isDisconnect({id, updateType, relation}) {
  return idLength(id) > 1 &&
    updateType === 'disconnect' &&
    relation;
}


function idLength(id) {
  return typeof id === 'string' &&
    id.split('/').length;
}

function isObjectAction(rootValue, id) {
  return isPlainObject(rootValue[id.split('/')[0]]);
}

export function isArrayAction(rootValue, id) {
  return isArray(rootValue[id.split('/')[0]]);
}
