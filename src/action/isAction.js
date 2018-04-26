import {Map, List, update} from 'immutable';
const {isMap} = Map;
const {isList} = List;


/** create */

export function isCreateArray({id, updateType, rootValue}) {
  return idLength(id) === 2 &&
    updateType === 'create' &&
    isList(rootValue);
}

export function isCreateNestedArrayInArray({id, updateType, rootValue}) {
  return idLength(id) > 2 && 
    updateType === 'create' &&
    isList(rootValue);
}

export function isCreateNestedArrayInObject({id, updateType, rootValue}) {
  return idLength(id) > 1 &&
    updateType === 'update' &&
    isMap(rootValue);
}

export function isCreateAndConnect({id, updateType, relation}) {
  return idLength(id) > 2 &&
    updateType === 'create' &&
    relation;
}

/** delete */

export function isDeleteArray({id, updateType, rootValue}) {
  return idLength(id) === 2 &&
    updateType === 'delete' &&
    isList(rootValue);
}

export function isDeleteNestedArrayInArray({id, updateType, rootValue}) {
  return idLength(id) > 2 &&
    updateType === 'delete' &&
    isList(rootValue);
}

export function isDeleteNestedArrayInObject({id, updateType, rootValue}) {
  return idLength(id) > 1 &&
    updateType === 'delete' &&
    isMap(rootValue);
}

export function isDisconnectAndDelete({id, updateType, relation}) {
  return idLength(id) > 1 &&
    updateType === 'delete' &&
    relation;
}

/** update */

export function isUpdateArray({id, updateType, rootValue}) {
  return idLength(id) >= 2 &&
    updateType === 'update' &&
    isList(rootValue);
}

export function isUpdateObject({id, updateType, rootValue}) {
  return idLength(id) > 1 &&
    updateType === 'update' &&
    isMap(rootValue);
}

/** swap */

export function isSwapArrayInArray({id, updateType, rootValue}) {
  return updateType === 'swap' &&
    typeof id === 'object' &&
    isList(rootValue);
}

export function isSwapArrayInObject({id, updateType, rootValue}) {
  return updateType === 'swap' &&
    typeof id === 'object' &&
    isMap(rootValue);
}

/** connect */

export function isConnect({id, updateType, relation}) {
  return idLength(id) > 1 &&
    updateType === 'connect' &&
    relation;
}

/** disconnect */

export function isDisconnect({id, updateType, relation}) {
  return idLength(id) > 1 &&
    updateType === 'disconnect' &&
    relation;
}


function idLength(id) {
  return typeof id === 'string' &&
    id.split('/').length;
}