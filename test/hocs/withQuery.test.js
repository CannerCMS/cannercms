/**
|--------------------------------------------------
| this is just for copy and past
|--------------------------------------------------
*/


import * as React from 'react';
import Enzyme, { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';
import withQuery from '../../src/hocs/query';
import {fromJS} from 'immutable';
import RefId from 'canner-ref-id';

Enzyme.configure({ adapter: new Adapter() });

describe('with Query', () => {
  let WrapperComponent, props, MockComponent,
  mockFetch, mockSubscribe;

  beforeEach(() => {
    MockComponent = function MockComponent() {
      return (<div>Component</div>);
    }
    mockFetch = jest.fn().mockImplementation(() => Promise.resolve(fromJS({
      info: {
        name: 12
      }
    })));
    mockSubscribe = jest.fn().mockImplementation(() => Promise.resolve());
    props = {
      refId: new RefId('info'),
      componentId: 'info',
      query: {},
      fetch: mockFetch,
      subscribe: mockSubscribe
    }
    WrapperComponent = withQuery(MockComponent);
  });

  it('should render', () => {
    const wrapper = shallow(<WrapperComponent {...props}/>);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should query and scribe', () => {
    const wrapper = shallow(<WrapperComponent {...props}/>);
    mockFetch.mockClear();
    mockSubscribe.mockClear();
    return wrapper.instance().queryData().then(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  })
});