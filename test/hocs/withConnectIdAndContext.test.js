/**
|--------------------------------------------------
| this is just for copy and past
|--------------------------------------------------
*/


import * as React from 'react';
import Enzyme, { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';
import withConnectId from '../../src/hocs/connectId';
import RefId from 'canner-ref-id';

Enzyme.configure({ adapter: new Adapter() });

describe('hocTemplate', () => {
  let WrapperComponent, props, MockComponent, context,
  mockFetch, mockSubscribe, mockRequest, mockDeploy, mockReset;

  beforeEach(() => {
    MockComponent = function MockComponent() {
      return (<div>Component</div>);
    }
    props = {
      id: undefined,
      name: 'posts'
    }

    mockFetch = jest.fn();
    mockSubscribe = jest.fn();
    mockRequest = jest.fn();
    mockReset = jest.fn();
    mockDeploy = jest.fn();

    context = {
      componentId: undefined,
      query: undefined,
      fetch: mockFetch,
      subscribe: mockSubscribe,
      request: mockRequest,
      deploy: mockDeploy,
      reset: mockReset
    }

    WrapperComponent = withConnectId(MockComponent);
  });

  it('should render', () => {
    const wrapper = shallow(<WrapperComponent
      {...props}
    />, {context});
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should pass props', () => {
    const wrapper = shallow(<WrapperComponent
      {...props}
    />, {context});
    expect(wrapper.find(MockComponent).props()).toMatchObject({
      ...props,
      ...context,
      refId: expect.any(RefId),
      componentId: props.name,
      query: {}
    });
  });
});