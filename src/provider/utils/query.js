/**
 * @flow
 */
type dataType = {
    totalPage: number,
    data: Array<any>
  } | Array<any>

import getByPath from 'lodash/get';

export default class Query {
  data: dataType

  constructor({data}: {data: Array<any>}) {
    this.data = data;
  }

  filter(filter: {[key: string]: any} = {}) {
    const data = this.getPureData();
    this.setData(Object.keys(filter).reduce((result, key) => {
      return this._filterByKey(result, key, filter[key]);
    }, data));
    return this;
  }

  sort(sort: {[key: string]: 1 | -1} = {}) {
    const data = this.getPureData();
    // eslint-disable-next-line max-len
    const collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base', caseFirst: 'lower'});
    const key = Object.keys(sort)[0];
    const order = sort[key];
    this.setData(data.sort((a, b) => {
    // eslint-disable-next-line max-len
      return order > 0 ? collator.compare(a[key], b[key]) : collator.compare(b[key], a[key]);
    }));
    return this;
  }

  static turnPage(pagination?: {start: number, limit: number}) {
    if (!pagination) {
      return {page: 1, perPage: 10};
    }
    const {start, limit} = pagination;
    return {
      page: Math.ceil(start / limit) + 1,
      perPage: limit,
    };
  }

  page(pagination?: {page: number, perPage: number}) {
    const data = this.getPureData();
    if (!pagination) {
      return this;
    }
    const {page = 1, perPage = 10} = pagination;
    const queryData = data.slice(perPage * (page - 1), perPage * page);
    this.setData({
      goTo: (page) => ({
        start: (page - 1) * perPage,
        limit: perPage,
      }),
      page,
      totalPage: Math.ceil(data.length / perPage) || 0,
      data: queryData,
    });
    return this;
  }

  getPureData(): Array<any> {
    if (this.data && 'data' in this.data) {
      return (this.data: any).data;
    }
    return (this: any).data;
  }

  setData(data: dataType) {
    if (this.data && this.data.data) {
      (this.data: any).data = data;
    } else {
      this.data = data;
    }
  }

  getData() {
    return this.data;
  }

  // eslint-disable-next-line max-len
  _filterByKey(data: Array<any>, key: string, conditions: {[key: string]: any}) {
    return data.filter((datum) => {
      // eslint-disable-next-line max-len
      return Object.keys(conditions).reduce((result, conditionkey) => {
        // eslint-disable-next-line max-len
        return result && isValid(getByPath(datum, key.split('/'), ''), conditionkey, conditions[conditionkey]);
      }, true);
    });
  }
}

export function isValid(value: any, condition: string, conditionValue: any) {
  switch (condition) {
    case '$eq':
    case '$equal':
      // eslint-disable-next-line eqeqeq
      return value == conditionValue;
    case '$gt':
      return value > conditionValue;
    case '$gte':
      return value >= conditionValue;
    case '$lt':
      return value < conditionValue;
    case '$lte':
      return value <= conditionValue;
    case '$contains':
      return value.indexOf && value.indexOf(conditionValue) !== -1;
    case '$in':
      return conditionValue.indexOf && conditionValue.indexOf(value) !== -1;
    case '$regex':
      return new RegExp(conditionValue, 'g').test(value);
    default:
      return true;
  }
}

// eslint-disable-next-line max-len
export function passQuery(action: MutateAction, queryKey: string, totalPage: number) {
  if (action.type !== 'CREATE_ARRAY_ITEM') {
    return true;
  }
  // 用來判斷 CollectionUpadte 是否要在這個 query 的 data 下 mutate
  const allPage = queryKey === 'all';
  const query = allPage ? {filter: {}, pagination: {}} : JSON.parse(queryKey);
  const lastPage = getByPath(query, 'pagination.page', 1) === totalPage;
  const dataIsValid = new Query({data: [action.payload.value.toJS()]})
    .filter(query.filter).getPureData().length > 0;
  return dataIsValid && (allPage || lastPage);
}
