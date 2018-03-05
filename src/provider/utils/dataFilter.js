import isUndefined from 'lodash/isUndefined';
import isString from 'lodash/isString';

export default class DataFilter {
  constructor(schema) {
    this.schema = Object.values(schema)[0];
    this.key = Object.keys(schema)[0];
  }

  isCanBeFiltered() {
    const {filterKey, type} = this.schema;
    return !isUndefined(filterKey) && isString(filterKey) && type === 'array';
  }

  filterCannerJSON(cannerJSON) {
    if (cannerJSON.size === 0) {
      return cannerJSON;
    }
    if (this.isCanBeFiltered()) {
      return cannerJSON.set(this.key,
        // eslint-disable-next-line max-len
        cannerJSON.get(this.key) && cannerJSON.get(this.key).filter((item) => item.has(this.schema.filterKey)));
    }
    return cannerJSON;
  }
}
