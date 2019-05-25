// @flow
/* eslint-disable no-param-reassign */
import type { SchemaMap } from './types';


export function mapSchema(schemaMap: SchemaMap, fn: Function): any {
  return Object.keys(schemaMap || {})
    .reduce((result: any, key: string) => {
      result[key] = fn(schemaMap[key], key);
      return result;
    }, {});
}

export function genDefaultValue(defaultValue: any) {
  if (typeof defaultValue === 'function') {
    return defaultValue();
  }
  return defaultValue;
}
