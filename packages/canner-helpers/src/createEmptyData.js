// @flow

/**
 * producing the immutable data with the given argument
 *
 * if object => recurse its children
 * if array => new List
 * if string => ''
 * if boolean => false
 * if number => 0
 * if toOne relation => null
 * if toMany relation => null
 * if dateTime => string
 */

import {mapSchema, genDefaultValue} from './utils';
import type {Schema, SchemaMap} from './types';


function loop(schema: Schema) {
  let result: any;
  // $FlowFixMe
  if (typeof schema === 'object' && schema.defaultValue) {
    return genDefaultValue(schema.defaultValue);
  }
  switch (schema.type) {
    case 'object':
      result = mapSchema(schema.items, loop);
      result.__typename = result.__typename || null;
      break;
    case 'array':
      result = [];
      break;
    case 'number':
      result = 0;
      break;
    case 'geoPoint':
      result = {
        __typename: null,
        lat: 0,
        lng: 0,
        address: '',
        placeId: ''
      };
      break;
    case 'dateTime':
      result = '';
      break;
    case 'file':
      result = {
        __typename: null,
        contentType: '',
        size: 0,
        name: '',
        url: ''
      };
      break;
    case 'image':
      result = {
        __typename: null,
        contentType: '',
        size: 0,
        name: '',
        url: ''
      };
      break;
    case 'boolean':
      result = false;
      break;
    case 'string':
      result = '';
      break;
    case 'relation': {
      const {type} = schema.relation;
      switch (type) {
        case 'toMany':
          result = [];
          break;
        case 'toOne':
        default:
          result = null;
          break;
      }
      break;
    }
    case 'json': {
      result = {};
      break;
    }
    case 'component': {
      break;
    }
    case 'enum':
      result = '';
      break;
    default:
      throw new Error(`unsupport type ${schema.type}`);
      break;
  }
  return result;
}

export default function(schema: Schema | SchemaMap) {
  if (!schema) {
    return null;
  }
  if ('type' in schema) {
    return loop(((schema: any): Schema));
  }
  return mapSchema(((schema: any): SchemaMap), loop);
}