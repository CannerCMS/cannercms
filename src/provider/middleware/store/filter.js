// @flow
import set from 'lodash/set';
import get from 'lodash/get';
import has from 'lodash/has';
import mapValues from 'lodash/mapValues';
import flatten from 'lodash/flatten';
import isObject from 'lodash/isObject';
import values from 'lodash/values';
import {isValid} from '../../utils/query';
export default class Filter {
  filters: {
    [key: string]: {
      [filterKey: string]: {
        filter: MutateAction => boolean,
        entities: Array<string>
      }
    }
  }
  constructor() {
    this.filters = {};
  }

  createOrUpdate(key: string, filterCondition: {[string]: any}, componentId: string) {
    if (this.hasFilter(key, filterCondition)) {
      this.addEntity(key, filterCondition, componentId);
    } else {
      this.create(key, filterCondition, componentId);
    }
  }

  hasKey(key: string): boolean {
    return key in this.filters;
  }

  create(key: string, filterCondition: {[string]: any}, componentId: string) {
    const filterKey = this.generateFilterKey(filterCondition);
    const filter = this.generateFilter(filterCondition);
    let entities = [componentId];
    if (has(this.filters, [key, filterKey])) {
      entities = get(this.filters, [key, filterKey, 'entities']);
      entities.push(componentId);
    }
    set(this.filters, [key, filterKey], {
      filter,
      entities,
    });
  }

  addEntity(key: string, filterCondition: {[string]: any}, componentId: string) {
    const filterKey = this.generateFilterKey(filterCondition);
    const filter = this.generateFilter(filterCondition);
    const entities = get(this.filters, [key, filterKey, 'entities']);
    if (entities.indexOf(componentId) === -1) {
      entities.push(componentId);
    }
    set(this.filters, [key, filterKey], {
      filter,
      entities,
    });
  }

  hasFilter(key: string, filterCondition: {[string]: any}) {
    const filterKey = this.generateFilterKey(filterCondition);
    return has(this.filters, [key, filterKey]);
  }

  deleteEntities(key: string, filterCondition: {[string]: any}, componentId: string) {
    const filterKey = this.generateFilterKey(filterCondition);
    let entities = get(this.filters, [key, filterKey, 'entities']);
    entities = entities.filter((id) => id !== componentId);
    set(this.filters, [key, filterKey, 'entities'], entities);
  }

  getEntities(key: string, value: any) {
    return flatten(values(mapValues(this.getFilters(key), (v) => {
      if (value ? v.filter(value) : true) {
        return v.entities;
      }
      return [];
    })));
  }

  update(key: string, filterCondition: {[string]: any}, componentId: string) {
    let keysFilter = this.filters[key];
    // remove componentId in all filters
    keysFilter = mapValues(keysFilter, (v) => {
      v.entities = v.entities.filter((id) => id !== componentId);
      return v;
    });
    this.filters[key] = keysFilter;

    // create or update filter
    this.createOrUpdate(key, filterCondition, componentId);
  }

  getFilters(key: string) {
    return get(this.filters, [key]);
  }

  getFilter(key: string, query: {[string]: any}) {
    const queryString = this.generateFilterKey(query);
    return get(this.filters, [key, queryString, 'filter']);
  }

  generateFilterKey(filterCondition: {[string]: any}) {
    if (isObject(filterCondition)) {
      return JSON.stringify(filterCondition);
    }
    return 'UNKNOWN_FILTER';
  }
  // eslint-disable-next-line
  generateFilter(filterCondition: {[string]: any}) {
    return (value: any) => {
      if (!filterCondition) {
        return true;
      }
      return Object.keys(filterCondition).reduce((result, key) => {
        return this._filterByKey(value, key, filterCondition[key]);
      }, true);
    };
  }

  _filterByKey(value: any, key: string, filterCondition: {[string]: any}) {
    return Object.keys(filterCondition).reduce((result, conditionkey) => {
      // eslint-disable-next-line max-len
      return result && isValid(value.getIn(key.split('/')), conditionkey, filterCondition[conditionkey]);
    }, true);
  }
}
