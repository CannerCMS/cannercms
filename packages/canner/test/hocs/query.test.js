import * as React from 'react';
import Enzyme, { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';
import withQuery, {getValue, parseConnectionToNormal} from '../../src/hocs/query';
import RefId from 'canner-ref-id';
import { Query } from '../../src/query';

Enzyme.configure({ adapter: new Adapter() });

describe('with  query', () => {
  let WrapperComponent, props, MockComponent, mockFetch,
    mockUnsubscribe, mockSubscribe;

  beforeEach(() => {
    MockComponent = function MockComponent() {
      return (<div>Component</div>);
    }
    mockFetch = jest.fn().mockImplementation(() => Promise.resolve({
      posts: {
        edges: [{
          cursor: 'id1',
          node: {
            id: 'id1',
            title: 'post1'
          }
        }],
        pageInfo: {
          hasNextPage: false
        }
      }
    }));
    mockUnsubscribe = jest.fn();
    mockSubscribe = jest.fn().mockImplementation(() => ({
      unsubscribe: mockUnsubscribe
    }))
    props = {
      refId: new RefId('posts'),

      relation: undefined,
      items: {
        title: {
          tyep: 'string'
        }
      },
      query: new Query({schema: {
        posts: {
          type: 'array',
          items: {
            type: 'object',
            items: {
              title: {
                type: 'string'
              }
            }
          }
        }
      }}),
      fetch: mockFetch,
      subscribe: mockSubscribe,
      unsubscribe: mockUnsubscribe
    }
    WrapperComponent = withQuery(MockComponent);
  });

  it('should render', () => {
    const wrapper = shallow(<WrapperComponent {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
    wrapper.setState({
      isFetching: false
    });
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('queryData when mount', () => {
    shallow(<WrapperComponent {...props} />);
    expect(mockFetch).toHaveBeenCalledWith('posts');
  });

  it('subscribe should work this.subscribtion exists', () => {
    const wrapper = shallow(<WrapperComponent {...props} />);
    wrapper.instance().subscribe();
    expect(mockSubscribe).toHaveBeenCalledWith('posts', expect.anything(Function));
    expect(wrapper.instance().subscription).toHaveProperty('unsubscribe');
  });

  it('call unscribe should works', () => {
    const wrapper = shallow(<WrapperComponent {...props} />);
    wrapper.instance().subscribe();
    wrapper.instance().unsubscribe();
    expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
  });
});

describe('getValue', () => {
  it('should get connection map', () => {
    const value = {
      posts: {
        edges: [],
        pageInfo: {
          hasNextInfo: false
        }
      }
    };
    expect(getValue(value, ['posts'])).toEqual({
      edges: [],
      pageInfo: {
        hasNextInfo: false
      }
    });
  });

  it('should get item of list', () => {
    const value = {
      posts: {
        edges: [{
          cursor: 'dsa',
          node: {
            id: 'dsa',
            title: 'test'
          }
        }],
        pageInfo: {
          hasNextInfo: false
        }
      }
    };
    expect(getValue(value, ['posts', 0])).toEqual({
      id: 'dsa',
      title: 'test'
    });
  });

  test('should get the field of item of list', () => {
    const value = {
      posts: {
        edges: [{
          cursor: 'dsa',
          node: {
            id: 'dsa',
            title: 'test'
          }
        }],
        pageInfo: {
          hasNextInfo: false
        }
      }
    };
    expect(getValue(value, ['posts', 0, 'title'])).toEqual('test');
  });
});


describe('parseConnectionToNormal', () => {
  it('should work', () => {
    const value = {
      post: {
        edges: [{
          cursor: 'id1',
          node: {
            id: 'id1',
            title: 'test',
            users: {
              edges: [{
                cursor: 'id1',
                node: {
                  id: 'id1',
                  name: 'user1'
                }
              }],
              pageInfo: {
                hasNextPage: false
              }
            }
          }
        }],
        pageInfo: {
          hasNextPage: true
        }
      },
      info: {
        name: 'info',
        address: ['address1', 'address2'],
        family: {
          edges: [{
            cursor: 'id1',
            node: {
              id: 'id1',
              name: 'user1'
            }
          }],
          pageInfo: {
            hasNextPage: true
          }
        }
      }
    };
    expect(parseConnectionToNormal(value)).toEqual({
      post: [{
        id: 'id1',
        title: 'test',
        users: [{
          id: 'id1',
          name: 'user1'
        }]
      }],
      info: {
        name: 'info',
        address: ['address1', 'address2'],
        family: [{
          id: 'id1',
          name: 'user1'
        }]
      }
    });
  });
});