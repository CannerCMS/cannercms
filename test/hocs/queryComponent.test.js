import Toolbar, {parseOrder, parsePagination, parseWhere} from '../../src/hocs/components/toolbar';
import * as React from 'react';
import Enzyme, { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';
import RefId from 'canner-ref-id';
import {Query} from '../../src/query';

Enzyme.configure({ adapter: new Adapter() });

describe('parse order', () => {
  it('should work', () => {
    const args = {
      orderBy: 'age_DESC'
    }
    const {orderField, orderType} = parseOrder(args.orderBy);
    expect(orderField).toBe('age');
    expect(orderType).toBe('DESC');
  });

  it('should return default', () => {
    const args = {

    };
    const {orderField, orderType} = parseOrder(args.orderBy);
    expect(orderField).toEqual(null);
    expect(orderType).toBe('ASC');
  });
});

describe('parse pagination', () => {
  it('should work', () => {
    const pagination = {
      first: 1,
      after: 3
    };

    expect(parsePagination(pagination)).toEqual(pagination);
  });
});

describe('parse where', () => {
  it('string 1', () => {
    const where = {
      name: 'name'
    };
    expect(parseWhere(where)).toEqual({
      name: {
        eq: 'name'
      }
    });
  });

  it('string 2', () => {
    const where = {
      name_eq: 'name'
    };
    expect(parseWhere(where)).toEqual({
      name: {
        eq: 'name'
      }
    });
  })

  it('number 1', () => {
    const where = {
      number: 1
    };
    expect(parseWhere(where)).toEqual({
      number: {
        eq: 1
      }
    });
  })

  it('number 2', () => {
    const where = {
      number_gt: 1
    };
    expect(parseWhere(where)).toEqual({
      number: {
        gt: 1
      }
    });
  });

  it('object 1', () => {
    const where = {
      author: {
        name: 'name'
      }
    };
    expect(parseWhere(where)).toEqual({
      author: {
        name: {
          eq: 'name'
        }
      }
    });
  })
});

describe('toolbar method', () => {
  let props, query, refId, items, value, toolbar;

  beforeEach(() => {
    const schema = {
      posts: {
        type: 'array',
        items: {
          type: 'object',
          items: {
            title: {
              type: 'string'
            },
            like: {
              type: 'number'
            },
            share: {
              type: 'number'
            }
          }
        }
      }
    };
    refId = new RefId('posts');
    query = new Query({
      schema
    });
    value = {
      edges: [{
        cursor: "0",
        node: {
          id: "0",
          title: "posts1"
        }
      }],
      pageInfo: {
        hasNextPage: true
      }
    }
    items = schema.posts.items.items;
    toolbar = {
      sort: {},
      pagination: {},
      filter: {}
    }
    props = {
      items,
      refId,
      query,
      value,
      toolbar,
      args: query.getQueries(refId.getPathArr()).args,
    };
  });

  it('should render', () => {
    const wrapper = shallow(<Toolbar {...props}>
      <div></div>
    </Toolbar>);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should change order', () => {
    const wrapper = shallow(<Toolbar {...props}>
      <div></div>
    </Toolbar>);
    wrapper.instance().changeOrder({
      orderField: 'like',
      orderType: 'DESC'
    });
    const {orderBy} = query.getQueries(refId.getPathArr()).args;
    expect(orderBy).toBe('RANDOM_KEY');
  });

  it('should change filter', () => {
    const wrapper = shallow(<Toolbar {...props}>
      <div></div>
    </Toolbar>);
    wrapper.instance().changeFilter({
      share: {
        gt: 1
      }
    });
    const {where} = query.getQueries(refId.getPathArr()).args;
    expect(where).toEqual("RANDOM_KEY");
  });

  it('should nextPage', () => {
    const wrapper = shallow(<Toolbar {...props}>
      <div></div>
    </Toolbar>);
    wrapper.instance().nextPage();
    const {pagination} = query.getQueries(refId.getPathArr()).args;
    expect(pagination).toEqual("RANDOM_KEY");
  });

  it('should prevPage', () => {
    const wrapper = shallow(<Toolbar {...props}>
      <div></div>
    </Toolbar>);
    wrapper.instance().prevPage();
    const {pagination} = query.getQueries(refId.getPathArr()).args;
    expect(pagination).toEqual("RANDOM_KEY");
  });

  it('should changeSize', () => {
    const wrapper = shallow(<Toolbar {...props}>
      <div></div>
    </Toolbar>);
    wrapper.instance().changeSize(20);
    const {pagination} = query.getQueries(refId.getPathArr()).args;
    expect(pagination).toEqual("RANDOM_KEY");
  });
});