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

export function paginate(rootValue: Object, field: string, currentPage: number, pageSize: number = 10) {
  const copyValue = JSON.parse(JSON.stringify(rootValue));
  const index = (currentPage - 1) * pageSize;
  copyValue[field].edges = copyValue[field].edges.slice(index, index + pageSize);
  return copyValue;
}

export function filterByWhere(rootValue: Object, field: string, where: Object) {
  const copyValue = JSON.parse(JSON.stringify(rootValue));
  copyValue[field].edges = copyValue[field].edges.filter(edge => {
    return Object.keys(where).reduce((result, key) => {
      const condition = where[key];
      const data = edge.node[key];
      return result && passCondition(data , condition);
    }, true);
  });
  return copyValue;
}

export function passCondition(data: any, condition: Object) {
  return Object.keys(condition).reduce((result, conditionKey) => {
    let isPass = true;
    const conditionValue = condition[conditionKey];
    switch(conditionKey) {
      case 'contains':
        isPass = data.indexOf(conditionValue) !== -1;
        break;
      case 'eq':
        isPass = data === conditionValue;
        break;
      case 'gt':
        isPass = data > conditionValue;
        break;
      case 'gte':
        isPass = data >= conditionValue;
        break;
      case 'lt':
        isPass = data < conditionValue;
        break;
      case 'lte':
        isPass = data <= conditionValue;
        break;
    }
    return result && isPass;
  }, true);
}