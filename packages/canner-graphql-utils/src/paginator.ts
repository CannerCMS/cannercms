import Memory from 'lowdb/adapters/Memory';
import low from 'lowdb';
import isUndefined from 'lodash/isUndefined';
import isEmpty from 'lodash/isEmpty';
import _last from 'lodash/last';
import _first from 'lodash/first';

export interface Pagination {
  last: number;
  first: number;
  before: string;
  after: string;
}

export default async (data, pagination?: Pagination) => {
  const db = low(new Memory());

  let query = db.defaults({data}).get('data');

  // map id if id not exist
  query = query.map((ele, i) => {
    if (isUndefined(ele.id)) {
      return {
        id: String(i),
        ...ele
      };
    }
    return ele;
  });

  if (!pagination) {
    return {
      edges: query.value().map(row => {
        return {
          cursor: row.id,
          node: row
        };
      }),
      pageInfo: {
        hasNextPage: false
      }
    };
  }

  const originQuery = query;
  const {first, last, before, after} = pagination;
  if (!isUndefined(before)) {
    query = query.takeWhile(row => row.id !== before);
  }

  if (!isUndefined(after)) {
    query = query.takeRightWhile(row => row.id !== after);
  }

  if (!isUndefined(first)) {
    query = query.take(first);
  }

  if (!isUndefined(last)) {
    query = query.takeRight(last);
  }

  // return
  const rows = query.value();
  return {
    edges: rows.map(row => {
      return {
        cursor: row.id,
        node: row
      };
    }),
    pageInfo: {
      hasNextPage: isEmpty(rows)
        ? false
        : !isEmpty(originQuery.takeRightWhile(row => row.id !== (_last(rows) as any).id).value()),
      hasPreviousPage: isEmpty(rows)
        ? false
        : !isEmpty(originQuery.takeWhile(row => row.id !== (_first(rows) as any).id).value()),
      startCursor: (query.head().value() || {}).id,
      endCursor: (query.last().value() || {}).id
    }
  };
};
