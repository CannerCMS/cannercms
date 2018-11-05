import * as React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from '../react163Adapter';
import withTitleAndDescription, {Label} from '../../src/hocs/title';
import RefId from 'canner-ref-id';
import {Row} from 'antd';

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
    const wrapper = shallow(<WrapperComponent
      {...props}
    />);
    expect(wrapper.find(Label).length).toBe(1);
    expect(wrapper.find(Row).prop('type')).toBe('');
  });

  it('should render horizontal', () => {
    const wrapper = shallow(<WrapperComponent
      {...props}
      layout="horizontal"
    />);
    expect(wrapper.find(Label).length).toBe(1);
    expect(wrapper.find(Row).prop('type')).toBe('flex');
  });

  it('should render only Component if hideTitle', () => {
    const wrapper = shallow(<WrapperComponent
      {...props}
      hideTitle
    />);
    expect(wrapper.find(Label).prop('title')).toBe('');
  });
});