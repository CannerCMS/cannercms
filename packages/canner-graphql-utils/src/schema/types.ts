
export enum Types {
  ARRAY = 'ARRAY',
  OBJECT = 'OBJECT',
  STRING = 'STRING',
  BOOLEAN = 'BOOLEAN',
  INT = 'INT',
  ID = 'ID',
  IMAGE = 'IMAGE',
  FILE = 'FILE',
  DATETIME = 'DATETIME',
  GEOPOINT = 'GEOPOINT',
  JSON = 'JSON',
  RELATION = 'RELATION'
}

export interface Field {
  exists(): boolean;
  hasChild(): boolean;
  getKey(): string;
  getType(): Types;
  getChild(fieldName: string): Field;
  forEach(visitor: (field: Field) => any);
}
