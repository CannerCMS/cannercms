// @flow

import type {SchemaMap} from './types';


export function mapSchema(schemaMap: SchemaMap, fn: Function) {
  return Object.keys(schemaMap || {})
    .reduce((result: {[string]: mixed}, key: string) => {
      result[key] = fn(schemaMap[key]);
      return result;
    }, {});
}

export function genDefaultValue(defaultValue: any) {
  if (typeof defaultValue === 'function') {
    return defaultValue();
  }
  return defaultValue;
}
