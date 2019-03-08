// @flow
import {get, isPlainObject, isArray} from 'lodash';

export function getFieldValue(value: any, idPathArr: Array<string>) {
  return idPathArr.reduce((result: any, key: string) => {
    if (isPlainObject(result)) {
      if ('edges' in result && result.edges[key] && 'node' in result.edges[key]) {
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

export function getEmptyValue({
  type,
  relation,
  nullable
}: {
  type: string,
  relation: any,
  nullable?: boolean
}) {
  if (nullable) {
    return null;
  }
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