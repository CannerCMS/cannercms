import mapValues from 'lodash/mapValues';
import { Types, Field } from './types';
import ScalarField from './scalarField';
import ArrayField from './arrayField';
import ObjectField from './objectField';
import RelationField from './relationField';
import CompositeField from './compositeField';

export const getType = (type: string): Types | null => {
  const upperType = type.toUpperCase();
  const enumType: Types = Types[upperType];
  return enumType || null;
};

export const createField = (key: string, rootSchema: any, schema: any): Field => {
  const type = getType(schema.type);
  switch (type) {
    case Types.ARRAY:
      return new ArrayField({key, rootSchema, schema});

    case Types.OBJECT:
      return new ObjectField({key, rootSchema, schema});

    case Types.RELATION:
      return new RelationField({key, rootSchema, schema});

    /**
     * File {contentType: string, name: string, size: string, url: string}
     * Image {contentType: string, name: string, size: string, url: string}
     */
    case Types.FILE:
    case Types.IMAGE: {
      const childFields = {
        contentType: {type: 'string'},
        name: {type: 'string'},
        size: {type: 'string'},
        url: {type: 'string'}
      };
      return new CompositeField({key, type, rootSchema, childFields});
    }

    /**
     * GeoPoint {lat: , lng: string, placeId: string}
     */
    case Types.GEOPOINT: {
      const childFields = {
        lat: {type: 'string'},
        lng: {type: 'string'},
        address: {type: 'string'},
        placeId: {type: 'string'}
      };
      return new CompositeField({key, type, rootSchema, childFields});
    }

    default:
      return new ScalarField({key, schema, type});
  }
};

export const createSchema = (rootSchema: any) => {
  return mapValues(rootSchema, (fieldSchema, key) => {
    return createField(key, rootSchema, rootSchema[key]);
  });
};

export const capitalizeFirstLetter = str => str.charAt(0).toUpperCase() + str.slice(1);

export const isCompositeType = (type: string) => {
  const enumType = getType(type);
  return [Types.FILE, Types.GEOPOINT, Types.IMAGE].indexOf(enumType) >= 0;
};
