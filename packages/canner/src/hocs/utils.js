// @flow
import {mapValues, get, isPlainObject, isArray} from 'lodash';

export function getValue(value: any, idPathArr: Array<string>) {
  return idPathArr.reduce((result: any, key: string) => {
    if (isPlainObject(result)) {
      if ('edges' in result && 'pageInfo' in result) {
        return get(result, ['edges', key, 'node']);
      }
      return get(result, key);
    } else if (isArray(result)) {
      return get(result, key);
    } else {
      return result;
    }
  }, value);
}

export function parseConnectionToNormal(value: any) {
  if (isPlainObject(value)) {
    if (value.edges && value.pageInfo) {
      return value.edges.map(edge => parseConnectionToNormal(edge.node));
    }
    return mapValues(value, item => parseConnectionToNormal(item));
  } else if (isArray(value)) {
    return value.map(item => parseConnectionToNormal(item))
  } else {
    return value;
  }
}

export function defaultValue(type: string, relation: any) {
  switch (type) {
    case 'connection': {
      return {
        edges: [],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false
        }
      }
    }
    case 'array': {
      return [];
    }
    case 'object': {
      return {};
    }
    case 'boolean': {
      return false;
    }
    case 'number': {
      return 0;
    }
    case 'string': {
      return '';
    }
    case 'relation': {
      if (relation.type === 'toMany') {
        return {
          edges: [],
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false
          }
        };
      } else {
        return null;
      }
    }
    case 'image':
    case 'file': {
      return {
        url: '',
        contentType: '',
        name: '',
        size: 0,
        __typename: null
      }
    }
    case 'geoPoint': {
      return {
        placeId: '',
        address: '',
        lat: 122,
        lng: 23
      };
    }
    default: {
      return null;
    }
  }
}