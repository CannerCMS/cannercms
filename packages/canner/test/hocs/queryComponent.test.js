import Toolbar, {parseOrder, parsePagination, parseWhere} from '../../src/hocs/components/toolbar';
import * as React from 'react';
import Enzyme, { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';
import RefId from 'canner-ref-id';
import {Query} from '../../src/query';
import {mapValues} from 'lodash';

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
  let props, query, refId, items, value, toolbar, updateQuery;

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
    query = new Query({
      schema
    });
    updateQuery = jest.fn();
    refId = new RefId('posts');
    value = {
      edges: [{
        cursor: "0",
        node: {
          id: "0",
          title: "posts1"
        }
      }],
      pageInfo: {
        hasNextPage: true,
        hasPreviousPage: true,
      }
    };
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
      updateQuery,
      args: mapValues(query.getQueries(refId.getPathArr()).args, v => query.getVairables()[v]),
    };
  });

  it('should render', () => {
    const wrapper = shallow(<Toolbar {...props}>
      <div></div>
    </Toolbar>);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should call updateQuery', () => {
    const wrapper = shallow(<Toolbar {...props}>
      <div></div>
    </Toolbar>);
    wrapper.instance().changeOrder({
      orderField: 'like',
      orderType: 'DESC'
    });
    expect(updateQuery.mock.calls[0][0]).toEqual(['posts']);
    expect(updateQuery.mock.calls[0][1]).toEqual({
      orderBy: 'like_DESC',
      first: 10,
    });
  });

  it('should call updateQuery', () => {
    const wrapper = shallow(<Toolbar {...props}>
      <div></div>
    </Toolbar>);
    wrapper.instance().changeFilter({
      share: {
        gt: 1
      }
    });
    expect(updateQuery.mock.calls[0][0]).toEqual(['posts']);
    expect(updateQuery.mock.calls[0][1]).toEqual({
      first: 10,
      where: {share_gt: 1}
    });
  });

  it('should call updateQuery', () => {
    const wrapper = shallow(<Toolbar {...props}>
      <div></div>
    </Toolbar>);
    wrapper.instance().nextPage();
    expect(updateQuery.mock.calls[0][0]).toEqual(['posts']);
    expect(updateQuery.mock.calls[0][1]).toEqual({
      orderBy: undefined,
      after: "0",
      first: 10,
      last: undefined,
      before: undefined,
      where: undefined
    });
  });

  it('should prevPage', () => {
    const wrapper = shallow(<Toolbar {...props}>
      <div></div>
    </Toolbar>);
    wrapper.instance().prevPage();
    expect(updateQuery.mock.calls[0][0]).toEqual(['posts']);
    expect(updateQuery.mock.calls[0][1]).toEqual({
      orderBy: undefined,
      first: undefined,
      after: undefined,
      before: "0",
      last: 10,
      where: undefined
    });
  });

  it('should changeSize', () => {
    const wrapper = shallow(<Toolbar {...props}>
      <div></div>
    </Toolbar>);
    wrapper.instance().changeSize(20);
    expect(updateQuery.mock.calls[0][0]).toEqual(['posts']);
    expect(updateQuery.mock.calls[0][1]).toEqual({
      orderBy: undefined,
      first: undefined,
      after: undefined,
      before: "0",
      last: 20,
      where: undefined
    });
  });
});