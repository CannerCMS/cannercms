// @flow

export function findAlwaysDisplayedFilterIndexes(filters: Array<Object>): Array<number> {
  const result = [];
  filters.forEach((filter, index) => {
    if (filter.alwaysDisplay) {
      result.push(index);
    }
  });
  return result;
}