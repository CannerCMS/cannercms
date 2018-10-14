import mapValues from 'lodash/mapValues';
import * as pluralize from 'pluralize';
const capitalizeFirstLetter = str => str.charAt(0).toUpperCase() + str.slice(1);

export const createDefaultData = (schema: any) => {
  return mapValues(schema, item => {
    const type = item.type.toLowerCase();
    switch (type) {
      case 'array':
        return [];
      case 'object':
        return {};
      default:
        throw new Error(`${type} not support`);
    }
  });
};

// fill in typename for relation
export const createSchemaForResolver = (schema: any) => {
  return mapValues(schema, item => {
    if (item && item.items) {
      item.items = createSchemaForResolver(item.items);
      return item;
    }

    if (item && item.relation) {
      item.relation.typename = capitalizeFirstLetter(pluralize.singular(item.relation.to));
    }
    return item;
  });
};
