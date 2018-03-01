// @flow
import {Map, List} from 'immutable';
import {UNIQUE_ID} from '../config';

function isNotList(value: any): boolean {
  if (!List.isList(value)) {
    console.error('value is not a list');
    return true;
  }
  return false;
}

function isNotMap(value: any): boolean {
  if (!Map.isMap(value)) {
    console.error('value is not a map');
    return true;
  }
  return false;
}

export default function mutate(originValue: any, action: MutateAction): any {
  switch (action.type) {
    case 'CREATE_ARRAY_ITEM': {
      if (isNotList(originValue)) {
        return originValue;
      }
      const {value} = action.payload;
      return originValue.push(value);
    }
    case 'CREATE_ARRAY_NESTED_ITEM': {
      if (isNotList(originValue)) {
        return originValue;
      }
      const {id, path, value} = action.payload;
      let collection = originValue;
      const index = collection.findIndex(item => item.get(UNIQUE_ID) === id);
      const paths = [index].concat(path.split('/'));
      let nestedCollection = collection.getIn(paths);
      if (!nestedCollection) {
        nestedCollection = new List();
      }
      nestedCollection = nestedCollection.push(value);
      collection = collection.setIn(paths, nestedCollection);
      return collection;
    }
    case 'CREATE_OBJECT_NESTED_ITEM': {
      if (isNotMap(originValue)) {
        return originValue;
      }
      const {path, value} = action.payload;
      const nestedPath = path.split('/');
      let mapData = originValue;
      let nestedCollection = mapData.getIn(nestedPath);
      if (!nestedCollection) {
        nestedCollection = new List();
      }
      nestedCollection = nestedCollection.push(value);
      mapData = mapData.setIn(nestedPath, nestedCollection);
      return mapData;
    }
    case 'UPDATE_ARRAY': {
      if (isNotList(originValue)) {
        return originValue;
      }
      const {id, path, value} = action.payload;
      let collection = originValue;
      const index = collection.findIndex(item => item.get(UNIQUE_ID) === id);
      if (index === -1) {
        return collection;
      }
      const restPath = path ? [index].concat(path.split('/')) : [index];
      collection = collection.setIn(restPath, value);
      return collection;
    }
    case 'UPDATE_OBJECT': {
      if (isNotMap(originValue)) {
        return originValue;
      }
      const {path, value} = action.payload;
      const restPath = path ? path.split('/') : [];
      let mapData = originValue;
      mapData = mapData.setIn(restPath, value);
      return mapData;
    }
    case 'DELETE_ARRAY_ITEM': {
      if (isNotList(originValue)) {
        return originValue;
      }
      const {id} = action.payload;
      let collection = originValue;
      const index = collection.findIndex(item => item.get(UNIQUE_ID) === id);
      if (index === -1) {
        return collection;
      }
      collection = collection.delete(index);
      return collection;
    }
    case 'DELETE_ARRAY_NESTED_ITEM': {
      if (isNotList(originValue)) {
        return originValue;
      }
      const {id, path} = action.payload;
      let collection = originValue;
      const index = collection.findIndex(item => item.get(UNIQUE_ID) === id);
      if (index === -1) {
        return collection;
      }
      const nestedPath = [index].concat(path.split('/').slice(0, -1));
      const nestedIndex = path.split('/').slice(-1)[0];
      let nestedCollection = collection.getIn(nestedPath);
      nestedCollection = nestedCollection.remove(nestedIndex);
      collection = collection.setIn(nestedPath, nestedCollection);
      return collection;
    }
    case 'DELETE_OBJECT_NESTED_ITEM': {
      if (isNotMap(originValue)) {
        return originValue;
      }
      const {path} = action.payload;
      const nestedPath = path.split('/').slice(0, -1);
      const nestedIndex = path.split('/').slice(-1)[0];
      let mapData = originValue;
      let nestedCollection = mapData.getIn(nestedPath);
      nestedCollection = nestedCollection.remove(nestedIndex);
      mapData = mapData.setIn(nestedPath, nestedCollection);
      return mapData;
    }
    // swap array item do nothing
    case 'SWAP_ARRAY_ITEM': {
      return originValue;
    }
    case 'SWAP_ARRAY_NESTED_ITEM': {
      if (isNotList(originValue)) {
        return originValue;
      }
      const {id, path} = action.payload;
      const [firstPath, secondPath] = path;
      let collection = originValue;
      const index = collection.findIndex(item => item.get(UNIQUE_ID) === id);
      if (index === -1) {
        return collection;
      }
      const firstPaths = [index].concat(firstPath.split('/'));
      const secondPaths = [index].concat(secondPath.split('/'));
      const firstValue = collection.getIn(firstPaths);
      const secondValue = collection.getIn(secondPaths);
      collection = collection.setIn(firstPaths, secondValue)
        .setIn(secondPaths, firstValue);
      return collection;
    }
    case 'SWAP_OBJECT_NESTED_ITEM': {
      if (isNotMap(originValue)) {
        return originValue;
      }
      const [firstPath, secondPath] = action.payload.path;
      const firstPaths = firstPath.split('/');
      const secondPaths = secondPath.split('/');
      let mapData = originValue;
      const firstValue = mapData.getIn(firstPaths);
      const secondValue = mapData.getIn(secondPaths);
      mapData = mapData.setIn(firstPaths, secondValue)
        .setIn(secondPaths, firstValue);
      return mapData;
    }
    default:
      return null;
  }
}
