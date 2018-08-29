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

import invariant from 'invariant';

type ObjectSchema = {
  items: SchemaMap;
  type: 'object';
  ui: string;
}

type ArraySchema = {
  items: Schema;
  type: 'array';
  ui: string;
}

type StringSchema = {
  type: 'string';
  ui: string;
}

type NumberSchema = {
  type: 'number';
  ui: string;
}

type BooleanSchema = {
  type: 'boolean';
  ui: string;
}

type RelationSchema = {
  type: 'relation';
  ui: string;
  relation: {
    type: string;
    to: string;
  }
};

type GeoPointSchema = {
  type: 'geoPoint',

}

type DateTimeSchema = {
  type: 'dateTime'
}

type FileSchema = {
  type: 'file',
}

type ImageScheme = {
  type: 'image'
}

type Schema = ArraySchema | ObjectSchema | StringSchema | BooleanSchema | NumberSchema | RelationSchema
  | GeoPointSchema | DateTimeSchema | FileSchema | ImageScheme;

type SchemaMap = {
  [string]: Schema;
};

function loop(schema: Schema) {
  let result: any;
  // $FlowFixMe
  if (typeof schema === 'object' && schema.defaultValue) {
    return genDefaultValue(schema.defaultValue);
  }
  switch (schema.type) {
    case 'object':
      result = mapSchema(schema.items);
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
    default:
      invariant(true, `unsupport type ${schema.type}`);
      break;
  }
  return result;
}

function mapSchema(schemaMap: SchemaMap) {
  return Object.keys(schemaMap || {})
    .reduce((result: {[string]: mixed}, key: string) => {
      result[key] = loop(schemaMap[key]);
      return result;
    }, {});
}

export function genDefaultValue(defaultValue: any) {
  if (typeof defaultValue === 'function') {
    return defaultValue();
  }
  return defaultValue;
}

export default function(schema: Schema | SchemaMap) {
  if (!schema) {
    return null;
  }
  if ('type' in schema) {
    return loop(((schema: any): Schema));
  }
  return mapSchema(((schema: any): SchemaMap));
}