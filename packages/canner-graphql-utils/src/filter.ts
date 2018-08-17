import Memory from 'lowdb/adapters/Memory';
import low from 'lowdb';
import isEmpty from 'lodash/isEmpty';
import isPlainObject from 'lodash/isPlainObject';
import get from 'lodash/get';

const createFilterFromComparator = (field, value, op) => {
  switch (op) {
    case 'eq':
      return data => get(data, field) === value;

    case 'gt':
      return data => get(data, field) > value;

    case 'gte':
      return data => get(data, field) >= value;

    case 'lt':
      return data => get(data, field) < value;

    case 'lte':
      return data => get(data, field) <= value;
  }
};

export const filter = ({data, where, order}: {data: any, where: any, order: any}) => {
  const db = low(new Memory());

  let query = db.defaults({data}).get('data');

  // where
  // -> {id: {schema, op: {eq: 1}}, age: {schema, op: {gt: 10}}, author: {schema, op: {name, age}}}
  if (!isEmpty(where)) {
    Object.keys(where).forEach(field => {
      const {op} = where[field];
      Object.keys(op).forEach(comparator => {
        const queryValue = op[comparator];
        if (isPlainObject(queryValue)) {
          // queryValue = {op: {gt: 10}}
          const nestedField = comparator;
          Object.keys(queryValue.op).forEach(nestedFieldComparator => {
            query = query.filter(
              createFilterFromComparator(
                `${field}.${nestedField}`,
                queryValue.op[nestedFieldComparator],
                nestedFieldComparator
              ));
          });
        } else {
          query = query.filter(createFilterFromComparator(field, queryValue, comparator));
        }
      });
    });
  }

  // order
  if (!isEmpty(order)) {
    const orderBy = order.value > 0 ? 'asc' : 'desc';
    query = query.orderBy([order.key], [orderBy]);
  }
  return query.value();
};
