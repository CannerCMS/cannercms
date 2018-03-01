/**
 * @flow
 */

import {fromJS} from 'immutable';
import {
  CollectionCreate,
  CollectionUpdate,
  CollectionDelete,
  MapUpdate,
  Noop,
  types
} from './actions';
import type Endpoint from './endpoint';
import flatten from 'lodash/flatten';

/* eslint-disable max-len */
const isCollection = dataType => dataType === types.collection;
const isMap = dataType => dataType === types.map;

const collectionConditions = {
  createItem: (dataType: string, qaType: string, idPath: Array<string>) => (isCollection(dataType) && qaType === 'create' && idPath.length === 1),
  update: (dataType: string, qaType: string) => (isCollection(dataType) && qaType === 'update'),
  deleteItem: (dataType: string, qaType: string, idPath: Array<string>) => (isCollection(dataType) && qaType === 'delete' && idPath.length === 2),
  createNestedItem: (dataType: string, qaType: string, idPath: Array<string>) => (isCollection(dataType) && qaType === 'create' && idPath.length > 2),
  deleteNestedItem: (dataType: string, qaType: string, idPath: Array<string>) => (isCollection(dataType) && qaType === 'delete' && idPath.length > 2),
  // swap
  swap: (dataType: string, qaType: string, idPath: Array<string>) => (isCollection(dataType) && qaType === 'swap' && idPath.length === 2),
  swapNested: (dataType: string, qaType: string, idPath: Array<string>) => (isCollection(dataType) && qaType === 'swap' && idPath.length > 2)
};

const mapConditions = {
  updateIn: (dataType: string, qaType: string) => (isMap(dataType) && qaType === 'update'),
  createNestedItem: (dataType: string, qaType: string) => (isMap(dataType) && qaType === 'create'),
  deleteNestedItem: (dataType: string, qaType: string) => (isMap(dataType) && qaType === 'delete'),
  swapNested: (dataType: string, qaType: string) => (isMap(dataType) && qaType === 'swap')
};
/* eslint-enable max-len */

type contructorArg = {
  actionDidDeploy?: void => void,
}

type createActionArg = {
  id: string | {
    firstId: string,
    secondId: string
  },
  type: string,
  value: any,
  dataType: string,
  endpoint: Endpoint
}

export default class ChangeAdaptor {
  actionDidDeploy: void => void

  constructor({actionDidDeploy = () => {}}: contructorArg) {
    this.actionDidDeploy = actionDidDeploy;
  }

  // return immutable
  // eslint-disable-next-line max-len
  createAction({id, type, value, dataType, endpoint}: createActionArg) {
    // $FlowFixMe
    const idPath = (type === 'swap') ? id.firstId.split('/') : id.split('/');

    /*
      swap
    */
    if (collectionConditions.swap(dataType, type, idPath)) {
      return new Noop();
    }

    if (collectionConditions.swapNested(dataType, type, idPath)) {
      return new CollectionUpdate({
        name: idPath[0],
        // swap nested item, firstId index should be same as secondId index
        // ex: swap /posts/0/members/0, /posts/0/members/3
        id: idPath[1],
        // use id as data, {firstId, secondId}
        data: id,
        endpoint,
        mutation: ({collection, index, data}) => {
          const {firstId, secondId} = data;
          const firstIdPath = firstId.split('/').slice(2);
          const secondIdPath = secondId.split('/').slice(2);
          const recordMap = collection.get(index);
          const firstValue = recordMap.getIn(firstIdPath);
          const secondValue = recordMap.getIn(secondIdPath);
          return collection.setIn(flatten([index, firstIdPath]), secondValue)
                          .setIn(flatten([index, secondIdPath]), firstValue);
        }
      });
    }

    if (mapConditions.swapNested(dataType, type)) {
      return new MapUpdate({
        name: idPath[0],
        data: id,
        endpoint,
        mutation: ({mapData, data}) => {
          const {firstId, secondId} = data;
          const firstIdPath = firstId.split('/').slice(1);
          const secondIdPath = secondId.split('/').slice(1);
          const firstValue = mapData.getIn(firstIdPath);
          const secondValue = mapData.getIn(secondIdPath);
          return mapData.setIn(firstIdPath, secondValue)
                        .setIn(secondIdPath, firstValue);
        }
      });
    }

    /*
      create, update, delete
    */
    /*
      collection
    */
    // create item in collection, ex: posts/UNIQUE_ID
    if (collectionConditions.createItem(dataType, type, idPath)) {
      return new CollectionCreate({
        name: idPath[0],
        data: value,
        endpoint
      });
    }

    // update value by a path in collection with any possible datatype
    // map, string, number, boolean ...
    // ex: (update item) posts/UNIQUE_ID, data: map{name, gender}
    // ex: (update item prop) posts/UNIQUE_ID/title, data: "string"
    // ex: (update nested item) posts/UNIQUE_ID/members/UNIQUE_ID, data: {name}
    // ex: (update nested item prop) posts/UNIQUE_ID/members/UNIQUE_ID/title, data: "string"
    // mutate => setIn
    if (collectionConditions.update(dataType, type)) {
      return new CollectionUpdate({
        name: idPath[0],
        id: idPath[1],
        path: idPath.slice(2),
        data: value,
        endpoint
      });
    }

    // delete item
    if (collectionConditions.deleteItem(dataType, type, idPath)) {
      return new CollectionDelete({
        name: idPath[0],
        id: idPath[1],
        endpoint
      });
    }

    /*
      collection nested array
    */
    // create nested item
    // mutate => setIn
    if (collectionConditions.createNestedItem(dataType, type, idPath)) {
      return new CollectionUpdate({
        name: idPath[0],
        id: idPath[1],
        path: idPath.slice(2),
        data: value,
        mutation: ({collection, index, path, data}) => {
          const originData = collection.getIn(flatten([index, path]));
          const updatedData = originData.push(fromJS(data));
          return collection.setIn(flatten([index, path]), updatedData);
        },
        endpoint
      });
    }

    // delete nested item
    // mutate => deleteIn
    if (collectionConditions.deleteNestedItem(dataType, type, idPath)) {
      return new CollectionUpdate({
        name: idPath[0],
        id: idPath[1],
        path: idPath.slice(2),
        mutation: ({collection, index, path}) => {
          return collection.deleteIn(flatten([index, path]));
        },
        endpoint
      });
    }

    /*
      Map
      all map's action should cached mutated data,
      and post the data to api at last
    */
    if (mapConditions.updateIn(dataType, type)) {
      return new MapUpdate({
        name: idPath[0],
        path: idPath.slice(1),
        data: value,
        endpoint
      });
    }

    /*
      map nested array
    */
    if (mapConditions.createNestedItem(dataType, type)) {
      return new MapUpdate({
        name: idPath[0],
        path: idPath.slice(1),
        data: value,
        endpoint,
        mutation: ({mapData, path, data}) => {
          const originData = mapData.getIn(path);
          const updatedData = originData.push(fromJS(data));
          return mapData.setIn(path, updatedData);
        }
      });
    }

    if (mapConditions.deleteNestedItem(dataType, type)) {
      return new MapUpdate({
        name: idPath[0],
        path: idPath.slice(1),
        mutation: ({mapData, path}) => {
          return mapData.deleteIn(path);
        },
        endpoint
      });
    }

    // not supported condition
    return new Noop();
  }
}
