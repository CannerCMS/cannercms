/**
|--------------------------------------------------
| this is just for copy and past
|--------------------------------------------------
*/


import * as React from 'react';
import Enzyme, { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';
import withHOC, {genDeployButton} from '../../src/hocs/deploy';
import {fromJS} from 'immutable';
import RefId from 'canner-ref-id';

Enzyme.configure({ adapter: new Adapter() });

describe('with route mini app', () => {
  let WrapperComponent, props, MockComponent,
    mockDeploy, mockReset;

  beforeEach(() => {
    MockComponent = function MockComponent() {
      return (<div>Component</div>);
    }
    mockDeploy = jest.fn().mockImplementation(() => Promise.resolve());
    mockReset = jest.fn().mockImplementation(() => Promise.resolve());
    props = {
      refId: new RefId('posts'),
      params: {},
      pattern: 'array',
      path: 'posts',
      routes: ['posts'],
      renderChildren: function renderChildren() {return <div></div>;},
      deploy: mockDeploy,
      reset: mockReset,
    }
    WrapperComponent = withHOC(MockComponent);
  });

  it('should render', () => {
    const wrapper = shallow(<WrapperComponent {...props}/>);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render normal button', () => {
    const renderButton = genDeployButton(() => {}, new RefId(''));
    expect(shallow(<div>
      {renderButton({
        component: function test({children}) {return <span>{children}</span>;},
        text: 'yoyo'
      })}
    </div>).html()).toBe("<div><span>yoyo</span></div>");
  })

  it('should renderButton when routes.length === 1', () => {
    const wrapper = shallow(<WrapperComponent {...props}
      routes={['posts']}
      path="post"
      refId={new RefId('posts')}
      pattern="array"
      />);
    expect(wrapper.find('Button').length).toBe(2);
  });

  it('should not renderButton when routes end at children', () => {
    const wrapper = shallow(<WrapperComponent {...props}
      routes={['posts', '<postId>']}
      path="post"
      refId={new RefId('posts')}
      pattern="array"
    />);
    expect(wrapper.find('Button').length).toBe(0);
  });

  it('should not renderButton when routes end at parent', () => {
    const wrapper = shallow(<WrapperComponent {...props}
      routes={['posts']}
      path="post/title"
      refId={new RefId("posts/<postId>/title")}
      pattern="array.string"
      />);
    expect(wrapper.find('Button').length).toBe(0);
  });

  it('should renderButton when first tab', () => {
    const wrapper = shallow(<WrapperComponent {...props}
      routes={['tab']}
      refId={new RefId("tab")}
      path="tab"
      type="array"
    />);
    expect(wrapper.find('Button').length).toBe(2);
  });

  it('should not renderButton when nested tab', () => {
    const wrapper = shallow(<WrapperComponent {...props}
      routes={['info']}
      refId={new RefId("info/tab")}
      path="info/tab"
      type="object.array"
    />);
    expect(wrapper.find('Button').length).toBe(0);
  });

  it('should renderButton when string of array', () => {
    const wrapper = shallow(<WrapperComponent {...props}
      routes={['tags']}
      refId={new RefId("tags")}
      path="tags"
      type="array"
    />);
    expect(wrapper.find('Button').length).toBe(2);
  });

  it('should not renderButton when controlDeployAndResetButtons', () => {
    const wrapper = shallow(<WrapperComponent {...props}
      routes={['route']}
      refId={new RefId("route")}
      pattern="array"
      path="route"
      controlDeployAndResetButtons={true}
    />);
    expect(wrapper.find('Button').length).toBe(0);
    wrapper.setProps({
      ui: "breadcrumb"
    })
    expect(wrapper.find('Button').length).toBe(0);
  });

  it('should not renderButton when nested popup, breadcrumb', () => {
    const wrapper = shallow(<WrapperComponent {...props}
      routes={['route']}
      refId={new RefId("route")}
      path="route"
      pattern="array"
      controlDeployAndResetButtons={true}
    />);
    expect(wrapper.find('Button').length).toBe(0);
    wrapper.setProps({
      ui: "breadcrumb"
    })
    expect(wrapper.find('Button').length).toBe(0);
  });

  it('should not renderButton when routes end at parent, with nested popup, breadcrumb', () => {
    const wrapper = shallow(<WrapperComponent {...props}
      routes={['route2']}
      refId={new RefId("route/route2")}
      path="route/route2"
      pattern="object.array"
      controlDeployAndResetButtons={true}
    />);
    expect(wrapper.find('Button').length).toBe(0);
    expect(wrapper.find('Button').length).toBe(0);
  });

  it('should pass new method', () => {
    const wrapper = shallow(<WrapperComponent {...props}
      routes={['route']}
      refId={new RefId("route")}
    />);

    const childrenProps = wrapper.find(MockComponent).props();

    expect(childrenProps).toHaveProperty('renderDeployButton', wrapper.instance().renderDeployButton)
    expect(childrenProps).toHaveProperty('renderResetButton', wrapper.instance().renderResetButton)
  });
});