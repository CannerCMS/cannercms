// @flow

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

export type Schema = ArraySchema | ObjectSchema | StringSchema | BooleanSchema | NumberSchema | RelationSchema
  | GeoPointSchema | DateTimeSchema | FileSchema | ImageScheme;

export type SchemaMap = {
  [string]: Schema;
};
