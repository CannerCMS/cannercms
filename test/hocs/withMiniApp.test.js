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
  let WrapperComponent, props, MockComponent, MiniApp,
  appFetchMock, appDeployMock, appRequestMock, appSubscribeMock, appResetMock;

  beforeEach(() => {
    MockComponent = function MockComponent({renderChildren}) {
      return (<div >{renderChildren && renderChildren()}</div>);
    };
    appFetchMock = jest.fn().mockImplementation(() => Promise.resolve());
    appRequestMock = jest.fn().mockImplementation(() => Promise.resolve());
    appSubscribeMock = jest.fn().mockImplementation(() => Promise.resolve());
    appResetMock = jest.fn().mockImplementation(() => Promise.resolve());
    appDeployMock = jest.fn().mockImplementation(() => Promise.resolve());

    MiniApp = class MiniApp {
      constructor() {}
      deploy = appDeployMock
      fetch = appFetchMock
      subscribe = appSubscribeMock
      reset = appResetMock
      request = appRequestMock
    }

    props = {
      id: 'posts',
      request: () => Promise.resolve(),
      fetch: () => Promise.resolve(),
      subscribe: () => Promise.resolve(),
      deploy: () => Promise.resolve(),
      componentId: 'posts'
    }
    WrapperComponent = withMiniApp(MockComponent, MiniApp);
  });

  it('should render and new an app and fetchData', () => {
    const wrapper = shallow(<WrapperComponent {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
    expect(wrapper.instance().app).toBeInstanceOf(MiniApp);
    expect(appFetchMock).toHaveBeenCalledTimes(1);
  });

  it('should pass methods to children', () => {
    const mockDeploy = jest.fn().mockImplementation(() => Promise.resolve());
    const methods = {
      request: () => Promise.resolve(),
      fetch: () => Promise.resolve(),
      subscribe: () => Promise.resolve(),
      deploy: mockDeploy,
      componentId: props.id
    };
    const wrapper = shallow(<WrapperComponent {...props} {...methods}/>);
    const methProps = wrapper.instance().getProps();
    appFetchMock.mockClear();
    appSubscribeMock.mockClear();
    appRequestMock.mockClear();
    appDeployMock.mockClear();
    appResetMock.mockClear();
    return Promise.all([
      methProps.fetch(),
      methProps.subscribe(),
      methProps.request(),
      methProps.deploy(),
      methProps.reset()
    ]).then(() => {
      expect(appFetchMock).toHaveBeenCalledTimes(1);
      expect(appSubscribeMock).toHaveBeenCalledTimes(1);
      expect(appRequestMock).toHaveBeenCalledTimes(1);
      expect(appDeployMock).toHaveBeenCalledTimes(1);
      expect(appResetMock).toHaveBeenCalledTimes(1);
      expect(mockDeploy).toHaveBeenCalledTimes(1);
    });
  });

  it('should edit renderChildren', () => {
    const mockRenderChildren = jest.fn().mockImplementation(() => <div></div>);
    const wrapper = shallow(<WrapperComponent {...props}
      renderChildren={mockRenderChildren}
    />);
    wrapper.render();
    expect(mockRenderChildren).toHaveBeenCalledWith({}, {
      onClick: wrapper.instance().deploy,
      key: props.id,
      id: undefined
    }, {
      onClick: wrapper.instance().reset,
      key: props.id,
      id: undefined
    })
  });
});