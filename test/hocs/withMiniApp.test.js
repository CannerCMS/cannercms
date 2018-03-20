/**
|--------------------------------------------------
| this is just for copy and past
|--------------------------------------------------
*/


import * as React from 'react';
import Enzyme, { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';
import {withMiniApp} from '../../src/hocs/miniApp';

Enzyme.configure({ adapter: new Adapter() });

describe('hocTemplate', () => {
  let WrapperComponent, props, MockComponent, MiniApp, appFetchMock, appDeployMock;

  beforeEach(() => {
    MockComponent = function MockComponent() {
      return (<div>Component</div>);
    };

    appFetchMock = jest.fn();
    appDeployMock = jest.fn();

    MiniApp = class MiniApp {
      constructor() {}
      deploy = (...args) => {appDeployMock(...args); return Promise.resolve();}
      fetch = () => {appFetchMock(); return Promise.resolve();}
      subscribe = () => Promise.resolve()
      reset = () => Promise.resolve()
      request = () => Promise.resolve()
    }

    props = {
      id: 'posts',
    }
    WrapperComponent = withMiniApp(MockComponent, MiniApp);
  });

  it('should render and new an app and fetchData', () => {
    const wrapper = shallow(<WrapperComponent {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
    expect(wrapper.instance().app).toBeInstanceOf(MiniApp);
    expect(appFetchMock).toHaveBeenCalledTimes(1);
  });

  it('should call context deploy in this.deploy', () => {
    const mock = jest.fn();
    const wrapper = shallow(<WrapperComponent {...props} />, {
      context: {
        request: () => Promise.resolve(),
        fetch: () => Promise.resolve(),
        subscribe: () => Promise.resolve(),
        deploy: (...args) => {mock(...args); return Promise.resolve();},
        componentId: props.id
      }
    });
    return wrapper.instance().deploy('key', 'id')
      .then(() => {
        expect(appDeployMock).toBeCalledWith('key', 'id');
        expect(mock).toBeCalledWith('key', 'id');
      });
  });
});