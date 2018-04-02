/**
|--------------------------------------------------
| this is just for copy and past
|--------------------------------------------------
*/


import * as React from 'react';
import Enzyme, { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import Adapter from '../react163Adapter';
import withConnectId from '../../src/hocs/connectId';
import {HOCContext as Context} from '../../src/hocs/context';
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
    const wrapper = mount(
      <Context.Provider value={context}>
        <WrapperComponent
          {...props}
        />
      </Context.Provider>
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should pass props', () => {
    const wrapper = mount(
      <Context.Provider value={context}>
        <WrapperComponent
          {...props}
        />
      </Context.Provider>
    );
    expect(wrapper.find(MockComponent).props()).toMatchObject({
      ...props,
      ...context,
      refId: expect.any(RefId),
      componentId: props.name,
      query: {}
    });
  });
});