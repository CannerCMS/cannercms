import Query from '../../src/app/utils/query';

const data = [
  {cate: 'cake', tags: ['tiger', 'ant', 'dog'], view: 50, share: 10},
  {cate: 'animals', tags: ['tiger', 'ant', 'dog'], view: 50, share: 50},
  {cate: 'animals', tags: ['ant', 'dog'], view: 50, share: 10},
  {cate: 'animals', tags: ['ant', 'dog'], view: 50, share: 10},
];

const cate = ['cake', 'flower'];
const dataContainTiger = data.filter((datum) => datum.tags.indexOf('tiger') !== -1);
const dataInCate = data.filter((datum) => cate.indexOf(datum.cate) !== -1);
const dataViewGte50 = data.filter((datum) => datum.view >= 50);
const dataShareLt50 = data.filter((datum) => datum.share < 50);

const filteredData = data.filter((datum) => {
  return datum.tags.indexOf('tiger') !== -1 &&
    cate.indexOf(datum.cate) !== -1 &&
    datum.view === 50 &&
    datum.share < 50;
});

describe('query', () => {
  it('filter contain tiger', () => {
    const query = new Query({data});
    expect(query.filter({
      tags: {$contains: 'tiger'},
    }).getPureData()).toEqual(dataContainTiger);
  });
  it('filter in Cate', () => {
    const query = new Query({data});
    expect(query.filter({
      cate: {$in: cate},
    }).getPureData()).toEqual(dataInCate);
  });
  it('filter view gte 50', () => {
    const query = new Query({data});
    expect(query.filter({
      view: {$gte: 50},
    }).getPureData()).toEqual(dataViewGte50);
  });
  it('filter share lt 50', () => {
    const query = new Query({data});
    expect(query.filter({
      share: {$lt: 50},
    }).getPureData()).toEqual(dataShareLt50);
  });
  it('multi filter', () => {
    const query = new Query({data});
    expect(query.filter({
      tags: {$contain: 'tiger'},
      cate: {$in: cate},
      view: {$eq: 50},
      share: {$lt: 50},
    }).getPureData()).toEqual(filteredData);
  });
});
