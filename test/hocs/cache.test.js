import * as React from 'react';
import Enzyme, {shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {fromJS} from 'immutable';
import withHOC, {isRoutesEndAtMe} from '../../src/hocs/cache';

Enzyme.configure({ adapter: new Adapter() });

describe('is routes end at me', () => {
  test('object', () => {
    let path = 'info';
    let routes = ['info'];
    const pattern = 'object.object.string';
    expect(isRoutesEndAtMe({
      path,
      routes,
      pattern
    })).toBeTruthy();
    path = 'info/info2';
    expect(isRoutesEndAtMe({
      path,
      routes,
      pattern
    })).toBeFalsy();
    routes.push('info2');
    expect(isRoutesEndAtMe({
      path,
      routes,
      pattern
    })).toBeTruthy();
  });
  test('array', () => {
    let path = 'posts';
    let routes = ['posts'];
    const pattern = 'array.object.string';
    expect(isRoutesEndAtMe({
      path,
      routes,
      pattern
    })).toBeFalsy();
    routes.push('id1');
    expect(isRoutesEndAtMe({
      path,
      routes,
      pattern
    })).toBeTruthy();
    path = 'posts/info';
    expect(isRoutesEndAtMe({
      path,
      routes,
      pattern
    })).toBeFalsy();
  })
});

describe('with cache', () => {
  let WrapperComponent, props, MockComponent, pattern,
    mockFetch, mockRequest, mockDeploy, mockReset, mockSubscribe;

  beforeEach(() => {
    MockComponent = function MockComponent() {
      return (<div>Component</div>);
    }
    pattern = 'object';
    mockFetch = jest.fn().mockImplementation(() => Promise.resolve(fromJS({
      info: {
        name: '123'
      }
    })));
    mockRequest = jest.fn();
    mockDeploy = jest.fn();
    mockReset = jest.fn();
    mockSubscribe = jest.fn();
    props = {
      params: {
        op: 'create'
      },
      routes: ['info'],
      fetch: mockFetch,
      request: mockRequest,
      deploy: mockDeploy,
      pattern,
      reset: mockReset,
      subscribe: mockSubscribe
    }
    WrapperComponent = withHOC(MockComponent);
  });

  test('fetch', () => {
    const wrapper = shallow(<WrapperComponent
      {...props}
    />);
    return wrapper.find(MockComponent).prop('fetch')().then(data => {
      expect(data.toJS()).toMatchObject({info: {name: '123'}});
    })
  });

  test('request should mutate data', () => {
    const wrapper = shallow(<WrapperComponent
      {...props}
    />);
    wrapper.setState({data: fromJS({
      info: {
        name: '123'
      }
    })});
    wrapper.find(MockComponent).prop('request')({
      type: 'UPDATE_OBJECT',
      payload: {
        key: 'info',
        value: fromJS({
          name: '321'
        })
      }
    });
    expect(mockRequest).toHaveBeenCalledTimes(0);
    return wrapper.find(MockComponent).prop('fetch')('info').then(data => {
      expect(data.toJS()).toMatchObject({info: {name: '321'}});
    })
  });

  test('deploy should request data', () => {
    const wrapper = shallow(<WrapperComponent
      {...props}
    />);
    wrapper.setState({data: fromJS({
      info: {
        name: '123'
      }
    })});
    wrapper.find(MockComponent).prop('request')({
      type: 'UPDATE_OBJECT',
      payload: {
        key: 'info',
        value: fromJS({
          name: '321'
        })
      }
    });
    wrapper.find(MockComponent).prop('deploy')('info');
    expect(mockRequest).toHaveBeenCalledTimes(1);
  });

  test('request should trigger subscribe', () => {
    const wrapper = shallow(<WrapperComponent
      {...props}
    />);
    wrapper.setState({data: fromJS({
      info: {
        name: '123'
      }
    })});
    const subscription = wrapper.find(MockComponent).prop('subscribe')('info', mockSubscribe);
    wrapper.find(MockComponent).prop('request')({
      type: 'UPDATE_OBJECT',
      payload: {
        key: 'info',
        value: fromJS({
          name: '321'
        })
      }
    });
    expect(mockSubscribe).toHaveBeenCalledTimes(1);
    expect(mockSubscribe.mock.calls[0][0].toJS()).toMatchObject({
      info: {
        name: '321'
      }
    });
    subscription.unsubscribe();
    expect(wrapper.instance().subscribers).toMatchObject({info: []});
  });
});
