import * as React from 'react';
import Enzyme, { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';
import withQuery from '../../src/hocs/query';
import {fromJS} from 'immutable';
import RefId from 'canner-ref-id';

Enzyme.configure({ adapter: new Adapter() });

describe('with  query', () => {
  let WrapperComponent, props, MockComponent, mockFetch,
    mockUnsubscribe, mockSubscribe;

  beforeEach(() => {
    MockComponent = function MockComponent() {
      return (<div>Component</div>);
    }
    mockFetch = jest.fn().mockImplementation(() => Promise.resolve(fromJS({
      posts: [{
        id: 'post1',
        title: 'POST1'
      }]
    })));
    mockUnsubscribe = jest.fn();
    mockSubscribe = jest.fn().mockImplementation(() => ({
      unsubscribe: mockUnsubscribe
    }))
    const rootValue = fromJS({
      posts: [{
        id: 'id1',
        title: 'post1'
      }]
    });
    props = {
      refId: new RefId('posts'),
      value: rootValue,
      rootValue,
      relation: undefined,
      items: {
        title: {
          tyep: 'string'
        }
      },
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
