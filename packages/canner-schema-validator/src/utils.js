// @flow

export function mapItems(items: Object, cb: Function): Array<any> {
  return Object.keys(items)
    .map(key => {
      const item = items[key];
      return enterSchema(item, cb);
    })
    // flatten
    .reduce((prev, curr) => prev.concat(curr), []);
}

export function enterSchema(schema: Object, cb: Function): Array<any> {
  const results = [].concat(cb(schema));
  if (schema.items) {
    if (schema.items.type === 'object') {
      results.concat(mapItems(schema.items.items, cb));
    } else {
      results.concat(mapItems(schema.items, cb));
    }
  }
  return results;
}