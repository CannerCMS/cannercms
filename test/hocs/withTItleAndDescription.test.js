import * as React from 'react';
import Enzyme, { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import Adapter from '../react163Adapter';
import withTitleAndDescription from '../../src/hocs/withTitleAndDescription';
import RefId from 'canner-ref-id';

Enzyme.configure({ adapter: new Adapter() });

describe('withTitleAndDescription', () => {
  let WrapperComponent, props, MockComponent;

  beforeEach(() => {
    MockComponent = function MockComponent() {
      return (<div>Component</div>);
    }
    props = {
      refId: new RefId('posts'),
      title: 'POSTS',
      description: 'many posts',
    }
    WrapperComponent = withTitleAndDescription(MockComponent);
  });

  it('should render vertical by default', () => {
    const wrapper = mount(<WrapperComponent
      {...props}
    />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render horizontal', () => {
    const wrapper = mount(<WrapperComponent
      {...props}
      layout="horizontal"
    />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render horizontal', () => {
    const wrapper = mount(<WrapperComponent
      {...props}
      layout="horizontal"
    />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render only Component if hideTitle', () => {
    const wrapper = mount(<WrapperComponent
      {...props}
      hideTitle
    />);
    expect(wrapper.html()).toBe("<div>Component</div>");
  })
});