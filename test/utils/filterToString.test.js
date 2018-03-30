import filterToString from '../../src/app/utils/queryToString';

const filter = {
  name: {$gt: 3, $lt: 50},
  year: {$gt: 30},
};

const sort = {
  name: 1,
};

const pagination = {
  page: 1,
  perPage: 10,
};

describe('filter to string', () => {
  it('filter to string', () => {
    // eslint-disable-next-line max-len
    const filterKey = JSON.stringify({filter});
    expect(filterToString({filter})).toEqual(filterKey);
  });

  it('undefined to string', () => {
    // eslint-disable-next-line max-len
    const filterKey = 'all';
    expect(filterToString()).toEqual(filterKey);
  });

  it('empty to string', () => {
    // eslint-disable-next-line max-len
    const filterKey = JSON.stringify({});
    expect(filterToString({})).toEqual(filterKey);
  });

  it('three to string', () => {
    // eslint-disable-next-line max-len
    const filterKey = JSON.stringify({filter, sort, pagination});
    expect(filterToString({filter, sort, pagination})).toEqual(filterKey);
  });
});
