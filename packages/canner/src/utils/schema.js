// @flow
import { isPlainObject } from 'lodash';

export function findSchemaByRefId(schema: Object, refId: any) {
  let paths = [];
  if (isPlainObject(refId)) {
    paths = refId.firstRefId.getPathArr();
  } else {
    paths = refId.getPathArr();
  }
  const pattern = '';
  return loop(schema, paths, pattern);
}

export function loop(schema: Object, paths: Array<string>, pattern: string): any {
  if (!schema) {
    return {};
  }
  if (paths.length === 0) {
    return {
      ...schema,
      pattern: removeFirstSlash(pattern),
    };
  }

  if (!schema.type) { // in items of object
    return loop(schema[paths[0]], paths.slice(1), `${pattern}/${schema[paths[0]].type}`);
  }

  if (schema.type === 'json') {
    return {};
  }

  if (schema.type === 'array') {
    if (paths.length === 1) {
      // paths = [index], so just return
      return loop(schema, [], pattern);
    } if (schema.items.type === 'object') {
      // path[0] is index, so we take the paths[1]
      return loop(schema.items.items[paths[1]], paths.slice(2), `${pattern}/${schema.items.items[paths[1]].type}`);
    }
  }
  return loop(schema.items[paths[0]], paths.slice(1), `${pattern}/${schema.items[paths[0]].type}`);
}

function removeFirstSlash(pattern: string) {
  return pattern.split('/').slice(1).join('/');
}
