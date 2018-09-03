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
import faker from 'faker';
import {mapSchema} from './utils';
import type {Schema, SchemaMap} from './types';
// createFakeData = (schema: Object, listLength: number) => *


export default function createFakeData(schema: Schema | SchemaMap, listLength: number = 0) {
  if (!schema) {
    return null;
  }
  if ('type' in schema) {
    return loop(((schema: any): Schema), listLength);
  }
  return mapSchema(((schema: any): SchemaMap), (schema: Schema) => loop(schema, listLength));
}


function loop(schema: Schema, listLength: number) {
  let result: any;

  switch (schema.type) {
    case 'object':
      result = mapSchema(schema.items, loop);
      result.__typename = result.__typename || null;
      break;
    case 'array':
      result = [];
      for (let i = 0; i < listLength; ++i) {
        result.push(mapSchema(schema.items.items, loop));
      }
      break;
    case 'number':
      result = faker.random.number();
      break;
    case 'geoPoint':
      result = {
        __typename: null,
        lat: faker.address.latitude(),
        lng: faker.address.longitude(),
        placeId: faker.random.uuid()
      };
      break;
    case 'dateTime':
      result = faker.date.past().toISOString();
      break;
    case 'file':
      result = {
        __typename: null,
        contentType: faker.system.mimeType(),
        size: faker.random.number(),
        name: faker.system.commonFileName(),
        url: faker.internet.url()
      };
      break;
    case 'image':
      result = {
        __typename: null,
        contentType: 'image/jpeg',
        size: faker.random.number(),
        name: faker.system.commonFileName(),
        url: faker.image.imageUrl()
      };
      break;
    case 'boolean':
      result = faker.random.boolean();
      break;
    case 'string':
      result = faker.random.word();
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
