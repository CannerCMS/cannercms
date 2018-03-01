// @flow

import {List, Map} from 'immutable';
import {UNIQUE_ID} from '../config';
import objectId from 'bson-objectid';
import isUndefined from 'lodash/isUndefined';
type updateType = 'create' | 'update' | 'delete' | 'swap';

function getCollectionActionType(updateType: updateType, paths: Array<string>) {
  switch (updateType) {
    case 'create':
      if (paths.length >= 2) {
        return 'CREATE_ARRAY_NESTED_ITEM';
      } else if (paths.length === 1) {
        return 'CREATE_ARRAY_ITEM';
      }
      return 'NOOP';
    case 'update':
      return 'UPDATE_ARRAY';
    case 'delete':
      if (paths.length > 2) {
        return 'DELETE_ARRAY_NESTED_ITEM';
      } else if (paths.length === 2) {
        return 'DELETE_ARRAY_ITEM';
      }
      return 'NOOP';
    case 'swap':
      if (paths.length > 2) {
        return 'SWAP_ARRAY_NESTED_ITEM';
      } else if (paths.length === 2) {
        return 'SWAP_ARRAY_ITEM';
      }
      return 'NOOP';
    default:
      return 'NOOP';
  }
}

function getMapActionType(updateType: updateType, paths: Array<string>) {
  switch (updateType) {
    case 'create':
      if (paths.length >= 2) {
        return 'CREATE_OBJECT_NESTED_ITEM';
      }
      return 'NOOP';
    case 'update':
      return 'UPDATE_OBJECT';
    case 'delete':
      if (paths.length >= 2) {
        return 'DELETE_OBJECT_NESTED_ITEM';
      }
      return 'NOOP';
    case 'swap':
      if (paths.length > 2) {
        return 'SWAP_OBJECT_NESTED_ITEM';
      }
      return 'NOOP';
    default:
      return 'NOOP';
  }
}

export default function(id: string | {firstId: string, secondId: string}, type: updateType, delta: any, value: any) {
  if (List.isList(value)) {
    if (type === 'swap') {
      const {firstId, secondId} = ((id: any): {firstId: string, secondId: string});
      const paths = firstId.split('/');
      const actionType = getCollectionActionType(type, paths);
      const key = paths.shift();
      const index = paths.shift();
      let recordId = value.getIn([index, UNIQUE_ID]);
      const path = [paths.join('/'), secondId.split('/').slice(2).join('/')];
      return {
        type: actionType,
        payload: {
          key,
          id: recordId,
          path,
          value: delta
        }
      };
    }
    const paths = ((id: any): string).split('/');
    const actionType = getCollectionActionType(type, paths);
    const key = paths.shift();
    const index = paths.shift();
    let recordId = value.getIn([index, UNIQUE_ID]);
    if (isUndefined(recordId)) {
      // create
      recordId = objectId().toString();
      delta = delta.set(UNIQUE_ID, recordId);
    }
    const path = paths.join('/');
    return {
      type: actionType,
      payload: {
        key,
        id: recordId,
        path,
        value: delta
      }
    };
  } else if (Map.isMap(value)) {
    if (type === 'swap') {
      const {firstId, secondId} = ((id: any): {firstId: string, secondId: string});
      const paths = firstId.split('/');
      const actionType = getMapActionType(type, paths);
      const key = paths.shift();
      const path = [paths.join('/'), secondId.split('/').slice(1).join('/')];
      return {
        type: actionType,
        payload: {
          key,
          path,
          value: delta
        }
      };
    }
    const paths = ((id: any): string).split('/');
    const actionType = getMapActionType(type, paths);
    const key = paths.shift();
    const path = paths.join('/');
    return {
      type: actionType,
      payload: {
        key,
        path,
        value: delta
      }
    };
  }
  return null;
}
