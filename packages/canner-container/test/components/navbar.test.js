
import * as React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { shallow } from 'enzyme';
import {Layout, Menu, Badge} from 'antd';

import Navbar from  '../../src/components/Navbar';
const {Header} = Layout;

Enzyme.configure({ adapter: new Adapter() });


const navbarConfig = {
  logo: 'http://www.img.jpg',
  showSaveButton: true,
  renderMenu: jest.fn()
};


const renderComponent = (props) => {
  return shallow(
    <Navbar
      dataChanged={{}}
      deploy={jest.fn()}
      {...navbarConfig}
      {...props}
    />
  )
};


describe('<Navbar>', () => {
  it('should render a Header', () => {
    const wrapper = renderComponent();
    expect(wrapper.find(Header).length).toBe(1);
  });

  it('should render three Menu', () => {
    const wrapper = renderComponent();
    expect(wrapper.find(Menu).length).toBe(3);
  });

  it('should render a Menu.Item', () => {
    const wrapper = renderComponent();
    expect(wrapper.find(Menu.Item).length).toBe(3);
  });

  it('should render a Badge', () => {
    const wrapper = renderComponent({ dataChanged: { 'key': true } });
    expect(wrapper.find(Badge).length).toBe(2);
  });


  it('should call deploy', () => {
    const deploy = jest.fn()
      .mockReturnValueOnce(Promise.resolve());
    const wrapper = renderComponent({ deploy });
    const menuItem = { key: 'deploy', params: {}};
    wrapper.find(Menu).first().simulate('click', menuItem);
    expect(deploy).toBeCalled();
  });
});
