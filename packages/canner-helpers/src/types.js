// @flow

type ObjectSchema = {
  items: SchemaMap;
  type: 'object';
  ui: string;
  keyName?: string;
  __typename: string;
}

type ArraySchema = {
  items: Schema;
  type: 'array';
  ui: string;
  keyName?: string;
}

type StringSchema = {
  type: 'string';
  ui: string;
  keyName?: string;
}

type NumberSchema = {
  type: 'number';
  ui: string;
  keyName?: string;
}

type BooleanSchema = {
  type: 'boolean';
  ui: string;
  keyName?: string;
}

type RelationSchema = {
  type: 'relation';
  ui: string;
  relation: {
    type: string;
    to: string;
  };
  keyName?: string;
};

type GeoPointSchema = {
  type: 'geoPoint';
  keyName?: string;
}

type DateTimeSchema = {
  type: 'dateTime';
  keyName?: string;
}

type FileSchema = {
  type: 'file';
  keyName?: string;
}

type ImageScheme = {
  type: 'image';
  keyName?: string;
}

export type Schema = ArraySchema | ObjectSchema | StringSchema | BooleanSchema | NumberSchema | RelationSchema
  | GeoPointSchema | DateTimeSchema | FileSchema | ImageScheme;

export type SchemaMap = {
  [string]: Schema;
};
