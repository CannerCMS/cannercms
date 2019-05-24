// @flow

export const types = {
  ARRAY: 'ARRAY',
  OBJECT: 'OBJECT',
  STRING: 'STRING',
  BOOLEAN: 'BOOLEAN',
  NUMBER: 'NUMBER',
  INT: 'INT',
  ID: 'ID',
  IMAGE: 'IMAGE',
  FILE: 'FILE',
  DATETIME: 'DATETIME',
  GEOPOINT: 'GEOPOINT',
  JSON: 'JSON',
  RELATION: 'RELATION',
  NULL: null,
  COMPONENT: 'COMPONENT',
};

export type Types = $Values<typeof types>;

export interface Field {
  exists(): boolean;
  getKey(): string;
  getType(): Types;
  getChild(fieldName: string): Field;
  forEach(visitor: (field: Field) => any): void;
}
