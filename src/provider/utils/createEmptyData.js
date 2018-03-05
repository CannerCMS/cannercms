// @flow

/**
 * producing the immutable data with the given argument
 *
 * if object => recurse its children
 * if array => new List
 * if string => ''
 * if boolean => false
 * if number => 0
 * if relation => according the relationship
 */

import * as Immutable from 'immutable';
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
    relationship: string;
    relationTo: string;
    foreignKey?: string;
    pickOne?: string;
  }
};

type Schema = ArraySchema | ObjectSchema | StringSchema | BooleanSchema | NumberSchema | RelationSchema;

type SchemaMap = {
  [string]: Schema;
};

function loop(schema: Schema) {
  let result: any;
  switch (schema.type) {
    case 'object':
      result = mapSchema(schema.items);
      break;
    case 'array':
      result = [];
      break;
    case 'number':
      result = 0;
      break;
    case 'boolean':
      result = false;
      break;
    case 'string':
      switch (schema.ui) {
        case 'editor':
          result = '<div>&nbsp;<br></div>';
          break;
        default:
          result = '';
          break;
      }
      break;
    case 'relation':
      const {relationship} = schema.relation;
      switch (relationship) {
        case 'oneToOne':
        case 'ManyToOne':
          result = '';
          break;
        case 'oneToMany.idMap':
          result = {};
          break;
        case 'oneToMany.idList':
          result = [];
          break;
        default:
          result = null;
          break;
      }
      break;
    default:
      invariant(true, `unsupport type ${schema.type}`);
      break;
  }
  return result;
}

function mapSchema(schemaMap: SchemaMap) {
  return Object.keys(schemaMap)
    .reduce((result: {[string]: mixed}, key: string) => {
      result[key] = loop(schemaMap[key]);
      return result;
    }, {});
}

export default function(schema: Schema | SchemaMap) {
  if ('type' in schema) {
    return Immutable.fromJS(loop(((schema: any): Schema)));
  }
  return Immutable.fromJS(mapSchema(((schema: any): SchemaMap)));
}
