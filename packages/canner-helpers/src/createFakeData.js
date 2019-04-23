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


export default function createFakeData(root: Schema | SchemaMap, listLength: number = 0) {
  if (!root) {
    return null;
  }
  const firstLevelKeys = getFirstLevelKeys(root);
  return root.hasOwnProperty('type') ? loop(((root: any): Schema), ((root: any): Schema).keyName): mapSchema(((root: any): SchemaMap), loop);

  // Loop schema
  function loop(schema: Schema, key: ?string) {
    let result: any;

    switch (schema.type) {
      case 'object': {
        if (schema.ui === 'editor') {
          result = {
            html: `<p>${faker.lorem.paragraphs()}</p>`
          }
          break;
        }
        result = mapSchema(schema.items, loop);
        result.__typename = result.__typename || null;
        break;
      }
      case 'array':
        result = getArrayData(schema, (key: any), listLength, loop);
        break;
      case 'number':
        result = faker.random.number();
        break;
      case 'geoPoint':
        result = {
          __typename: null,
          lat: faker.address.latitude(),
          lng: faker.address.longitude(),
          address: faker.address.city(),
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
          url: randomImg()
        };
        break;
      case 'boolean':
        result = faker.random.boolean();
        break;
      case 'string': {
        const lowerKeyName = schema.keyName && schema.keyName.toLowerCase() || '';
        if (lowerKeyName.indexOf('email') > -1) {
          result = faker.internet.email();
        } else if (lowerKeyName.indexOf('phone') > -1) {
          result = faker.phone.phoneNumber();
        } else if (schema.ui === "textarea") {
          result = faker.lorem.paragraphs();
        } else {
          result = faker.random.word();
        }
        break;
      }
      case 'enum': {
        if (schema.values) {
          result = schema.values[getRandomNumber(0, schema.values.length - 1)];
        } else {
          throw new Error('Enum type should have a values property.');
        }
        break;
      }
      case 'relation': {
        result = getRelation(schema, firstLevelKeys, listLength);
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
}

function getFirstLevelKeys(root: Schema | SchemaMap) {
  if ('type' in root) {
    return root.items ? Object.keys((root: any).items) : {};
  }
  return Object.keys(root);
}

function getArrayData(schema: any, key: string, listLength: number, loop: Function) {
  const result = [];
  for (let i = 0; i < listLength; ++i) {
    let item;
    if (schema.items && schema.items.items) {
      item = mapSchema(schema.items.items, loop);
    } else {
      item = schema.items.hasOwnProperty('type') ? loop(schema.items, schema.items.keyName): mapSchema(schema.items, loop);
    }

    if (typeof item === 'object' && key) {
      item = {
        ...item,
        id: `${key}${i+1}`
      };
    }
    result.push(item);
  }
  return result;
}

function getRelation(schema: Schema, firstLevelKeys: any, listLength: number) {
  const {type, to} = (schema: any).relation;
  const isInFirstLevel = Array.isArray(firstLevelKeys) && firstLevelKeys.indexOf(to) > -1 && listLength > 0;
  let result: any;

  switch (type) {
    case 'toMany':
      result = [];
      if (isInFirstLevel) {
        for(let i = 0; i < listLength; ++i) {
          if (Math.random() > 0.5 && to !== schema.keyName) {
            result.push(`${to}${i + 1}`);
          }
        }
      }
      break;
    case 'toOne':
    default:
      if (isInFirstLevel && to !== schema.keyName) {
        result = `${to}${getRandomNumber(1, listLength)}`;
      } else {
        result = null;
      }
      break;
  }
  return result;
}


export function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}

export function randomImg() {
  return `https://placeimg.com/${getRandomNumber(250, 350)}/${getRandomNumber(300, 400)}/any`
}