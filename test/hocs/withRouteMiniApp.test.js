/**
|--------------------------------------------------
| this is just for copy and past
|--------------------------------------------------
*/


import * as React from 'react';
import Enzyme, { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';
import withRouteMiniApp from '../../src/hocs/routeMiniApp';
import {fromJS} from 'immutable';

Enzyme.configure({ adapter: new Adapter() });

describe('with route mini app', () => {
  let WrapperComponent, props, MockComponent;

  beforeEach(() => {
    MockComponent = function MockComponent() {
      return (<div>Component</div>);
    }
    props = {
      id: 'posts',
      params: {},
      createEmptyData: () => fromJS({}),
      renderChildren: function renderChildren() {return <div></div>;}
    }
    WrapperComponent = withRouteMiniApp(MockComponent);
  });

  it('should render', () => {
    const wrapper = shallow(<WrapperComponent {...props}/>);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should renderButton when routedEndAtMe', () => {
    const wrapper = shallow(<WrapperComponent {...props}
      routes={['posts']}
    />);
    expect(toJson(wrapper)).toMatchSnapshot();
    expect(wrapper.find('Button').length).toBe(2);
  });

  it('should not renderButton when routes end at children', () => {
    const wrapper = shallow(<WrapperComponent {...props}
      routes={['posts', '<postId>']}
    />);
    expect(toJson(wrapper)).toMatchSnapshot();
    expect(wrapper.find('Button').length).toBe(0);
  });

  it('should not renderButton when routes end at parent', () => {
    const wrapper = shallow(<WrapperComponent {...props}
      routes={[]}
      id="posts/<postId>/title"
    />);
    expect(toJson(wrapper)).toMatchSnapshot();
    expect(wrapper.find('Button').length).toBe(0);
  });

  it('should not renderButton when first tab', () => {
    const wrapper = shallow(<WrapperComponent {...props}
      routes={['tab']}
      id="tab"
      ui="tab"
      type="array"
    />);
    expect(toJson(wrapper)).toMatchSnapshot();
    expect(wrapper.find('Button').length).toBe(0);
  });

  it('should not renderButton when nested tab, when route end at parent', () => {
    const wrapper = shallow(<WrapperComponent {...props}
      routes={[]}
      id="info/tab"
      ui="tab"
      type="array"
    />);
    expect(toJson(wrapper)).toMatchSnapshot();
    expect(wrapper.find('Button').length).toBe(0);
  });

  it('should renderButton when string of array', () => {
    const wrapper = shallow(<WrapperComponent {...props}
      routes={['tags']}
      id="tags"
      ui="tags"
      type="array"
    />);
    expect(toJson(wrapper)).toMatchSnapshot();
    expect(wrapper.find('Button').length).toBe(2);
  });

  it('should not renderButton when first opup, breadcrumb', () => {
    const wrapper = shallow(<WrapperComponent {...props}
      routes={['route']}
      id="route"
      ui="popup"
      type="array"      
    />);
    expect(toJson(wrapper)).toMatchSnapshot();
    expect(wrapper.find('Button').length).toBe(0);
    wrapper.setProps({
      ui: "breadcrumb"
    })
    expect(toJson(wrapper)).toMatchSnapshot();
    expect(wrapper.find('Button').length).toBe(0);
  });

  it('should not renderButton when nested popup, breadcrumb', () => {
    const wrapper = shallow(<WrapperComponent {...props}
      routes={['route']}
      id="route"
      ui="popup"
      type="array"
    />);
    expect(toJson(wrapper)).toMatchSnapshot();
    expect(wrapper.find('Button').length).toBe(0);
    wrapper.setProps({
      ui: "breadcrumb"
    })
    expect(toJson(wrapper)).toMatchSnapshot();
    expect(wrapper.find('Button').length).toBe(0);
  });

  it('should not renderButton when routes end at parent, with nested popup, breadcrumb', () => {
    const wrapper = shallow(<WrapperComponent {...props}
      routes={['route2']}
      id="route/route2"
      ui="popup"
      type="array"
    />);
    expect(toJson(wrapper)).toMatchSnapshot();
    expect(wrapper.find('Button').length).toBe(0);
    wrapper.setProps({
      ui: "breadcrumb"
    })
    expect(toJson(wrapper)).toMatchSnapshot();
    expect(wrapper.find('Button').length).toBe(0);
  });

  it('should init correct', () => {
    const wrapper = shallow(<WrapperComponent {...props}
      routes={['route']}
      id="route"
    />, {
      context: {
          request: () => {},
        fetch: () => Promise.resolve({response: {body: []}}),
        subscribe: () => {},
      }
    });
    expect(wrapper.state()).toMatchObject({
      routesEndAtMe: true,
      isCreateOp: false,
    });
    wrapper.setProps({
      routes: [],
      id: "route/route2"
    });
    expect(wrapper.state()).toMatchObject({
      routesEndAtMe: false,
      isCreateOp: false,
    });

    wrapper.setProps({
      routes: ['route2', 'route3'],
      id: "route/route2"
    });
    expect(wrapper.state()).toMatchObject({
      routesEndAtMe: false,
      isCreateOp: false,
    });

    wrapper.setProps({
      routes: ['post'],
      id: 'posts',
      params: {
        op: 'create'
      }
    });
    expect(wrapper.state()).toMatchObject({
      routesEndAtMe: true,
      isCreateOp: true
    });
  })
});