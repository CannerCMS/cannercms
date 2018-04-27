import {Map, List} from 'immutable';

/** create */

export function isCreateArray({id, updateType, rootValue, relation}) {
  return idLength(id) === 1 &&
    updateType === 'create' &&
    isList(rootValue, id) &&
    !relation;
}

export function isCreateNestedArrayInArray({id, updateType, rootValue, relation}) {
  return idLength(id) > 2 && 
    updateType === 'create' &&
    isList(rootValue, id) &&
    !relation;
}

export function isCreateNestedArrayInObject({id, updateType, rootValue, relation}) {
  return idLength(id) > 1 &&
    updateType === 'create' &&
    isMap(rootValue, id) &&
    !relation;
}

export function isCreateAndConnect({id, updateType, relation}) {
  return idLength(id) > 2 &&
    updateType === 'create' &&
    relation;
}

/** delete */

export function isDeleteArray({id, updateType, rootValue, relation}) {
  return idLength(id) === 2 &&
    updateType === 'delete' &&
    isList(rootValue, id) &&
    !relation;
}

export function isDeleteNestedArrayInArray({id, updateType, rootValue, relation}) {
  return idLength(id) > 2 &&
    updateType === 'delete' &&
    isList(rootValue, id) &&
    !relation;
}

export function isDeleteNestedArrayInObject({id, updateType, rootValue, relation}) {
  return idLength(id) > 1 &&
    updateType === 'delete' &&
    isMap(rootValue, id) &&
    !relation;
}

export function isDisconnectAndDelete({id, updateType, relation}) {
  return idLength(id) > 1 &&
    updateType === 'delete' &&
    relation;
}

/** update */

export function isUpdateArray({id, updateType, rootValue, relation}) {
  return idLength(id) >= 2 &&
    updateType === 'update' &&
    isList(rootValue, id) &&
    !relation;
}

export function isUpdateObject({id, updateType, rootValue, relation}) {
  return idLength(id) >= 1 &&
    updateType === 'update' &&
    isMap(rootValue, id) &&
    !relation;
}

/** swap */

export function isSwapRootArray({id, updateType, rootValue, relation}) {
  return updateType === 'swap' &&
    typeof id === 'object' &&
    idLength(id.firstId) === 2 &&
    isList(rootValue, id.firstId) &&
    !relation;
}

export function isSwapArrayInArray({id, updateType, rootValue, relation}) {
  return updateType === 'swap' &&
    typeof id === 'object' &&
    idLength(id.firstId) > 2 &&
    isList(rootValue, id.firstId) &&
    !relation;
}

export function isSwapArrayInObject({id, updateType, rootValue, relation}) {
  return updateType === 'swap' &&
    typeof id === 'object' &&
    idLength(id.firstId) > 1 &&
    isMap(rootValue, id.firstId) &&
    !relation;
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

function isMap(rootValue, id) {
  return Map.isMap(rootValue.get(id.split('/')[0]));
}

export function isList(rootValue, id) {
  return List.isList(rootValue.get(id.split('/')[0]));
}
