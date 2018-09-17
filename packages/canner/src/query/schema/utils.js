// @flow
import mapValues from 'lodash/mapValues';
import {types} from './types';
import ScalarField from './scalarField';
import ArrayField from './arrayField';
import ObjectField from './objectField';
import RelationField from './relationField';
import CompositeField from './compositeField';

import type {Types, Field} from './types';

export const getType = (type: string): Types | null => {
  const upperType = type.toUpperCase();
  const enumType: Types = types[upperType];
  return enumType || null;
};

export const createField = (key: string, rootSchema: any, schema: any, isEntity?: boolean): Field => {
  const type = getType(schema.type);
  switch (type) {
    case types.ARRAY:
      return new ArrayField({key, rootSchema, schema, isEntity});

    case types.OBJECT:
      return new ObjectField({key, rootSchema, schema, isEntity});

    case types.RELATION:
      return new RelationField({key, rootSchema, schema});

    /**
     * File {contentType: string, name: string, size: string, url: string}
     * Image {contentType: string, name: string, size: string, url: string}
     */
    case types.FILE:
    case types.IMAGE: {
      const childFields = {
        contentType: {type: 'string'},
        name: {type: 'string'},
        size: {type: 'string'},
        url: {type: 'string'}
      };
      return new CompositeField({key, type, rootSchema, childFields});
    }

    /**
     * GeoPoint {lat: , lng: string, placeId: string, address: string}
     */
    case types.GEOPOINT: {
      const childFields = {
        lat: {type: 'string'},
        lng: {type: 'string'},
        placeId: {type: 'string'},
        address: {type: 'string'}
      };
      return new CompositeField({key, type, rootSchema, childFields});
    }

    default:
      return new ScalarField({key, schema, type});
  }
};

export const createSchema = (rootSchema: any) => {
  return mapValues(rootSchema, (fieldSchema, key) => {
    return createField(key, rootSchema, rootSchema[key], true);
  });
};

export const capitalizeFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export const isCompositeType = (type: string) => {
  const enumType = getType(type);
  return [types.FILE, types.GEOPOINT, types.IMAGE].indexOf(enumType) >= 0;
};
