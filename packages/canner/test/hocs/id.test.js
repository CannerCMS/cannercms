/**
|--------------------------------------------------
| this is just for copy and past
|--------------------------------------------------
*/


import * as React from 'react';
import Enzyme, { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';
import withConnectContext from '../../src/hocs/connectContext';
import {HOCContext as Context} from '../../src/hocs/context';

Enzyme.configure({ adapter: new Adapter() });

describe('withConnectContext', () => {
  let WrapperComponent, props, MockComponent, context,
  mockFetch, mockSubscribe, mockRequest, mockDeploy, mockReset;

  beforeEach(() => {
    MockComponent = function MockComponent() {
      return (<div>Component</div>);
    }
    props = {
      id: undefined,
      keyName: 'posts',
      pattern: 'array',
      routes: ['posts']
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

    WrapperComponent = withConnectContext(MockComponent);
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
    expect(wrapper.find(MockComponent).props()).toHaveProperty('deploy');
    expect(wrapper.find(MockComponent).props()).toHaveProperty('fetch');
    expect(wrapper.find(MockComponent).props()).toHaveProperty('keyName');
    expect(wrapper.find(MockComponent).props()).toHaveProperty('query');
    expect(wrapper.find(MockComponent).props()).toHaveProperty('request');
    expect(wrapper.find(MockComponent).props()).toHaveProperty('reset');
    expect(wrapper.find(MockComponent).props()).toHaveProperty('subscribe');
  });
});