import * as React from 'react';
import Enzyme, { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';
import withTitleAndDescription from '../../src/hocs/withTitleAndDescription';

Enzyme.configure({ adapter: new Adapter() });

describe('withTitleAndDescription', () => {
  let WrapperComponent, props, MockComponent;

  beforeEach(() => {
    MockComponent = function MockComponent() {
      return (<div>Component</div>);
    }
    props = {
      id: 'posts',
      title: 'POSTS',
      description: 'many posts',
    }
    WrapperComponent = withTitleAndDescription(MockComponent);
  });

  it('should render vertical by default', () => {
    const wrapper = shallow(<WrapperComponent
      {...props}
    />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render horizontal', () => {
    const wrapper = shallow(<WrapperComponent
      {...props}
      layout="horizontal"
    />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render horizontal', () => {
    const wrapper = shallow(<WrapperComponent
      {...props}
      layout="horizontal"
    />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render only Component if hideTitle', () => {
    const wrapper = shallow(<WrapperComponent
      {...props}
      hideTitle
    />);
    expect(wrapper.equals(<MockComponent {...props} hideTitle />)).toBeTruthy();
  })
});