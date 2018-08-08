
import * as React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { shallow, mount } from 'enzyme';

import CannerContainer from  '../../src/components/index';

Enzyme.configure({ adapter: new Adapter() });

class TestChildren extends React.Component {
  render() {
    return (
      <div />
    );
  }
}

const sidebarConfig = {
  menuConfig: [{
    title: 'My Info',
    pathname: '/info'
  }, {
    title: 'Posts',
    pathname: '/posts'
  }, {
    title: 'Authors',
    pathname: '/authors'
  }]
};

const navbarConfig = {
  logo: 'http://www.img.jpg',
  showSaveButton: true,
  renderMenu: jest.fn()
};

const schema = {
  schema: {
    info: {type: 'object', title: 'My Info', keyName: 'info'},
    posts: {type: 'array', title: 'Posts', keyName: 'posts'},
    users: {type: 'array', title: 'Authors', keyName: 'authors'}
  }
};

const transformedSchemaMenuConfig = [{
  title: 'My Info',
  pathname: '/info'
}, {
  title: 'Posts',
  pathname: '/posts'
}, {
  title: 'Authors',
  pathname: '/authors'
}];

const router = {
  getRoutes: jest.fn().mockReturnValue(() => ['1', '2']),
  getParams: jest.fn(),
  goTo: jest.fn()
}

const renderComponent = (props) => {
  return shallow(
    <CannerContainer
      sidebarConfig={sidebarConfig}
      navbarConfig={navbarConfig}
      schema={schema}
      router={router}
      {...props}
    >
      <TestChildren />
    </CannerContainer>
  )
};

const renderMountComponent = (props) => {
  return mount(
    <CannerContainer
      sidebarConfig={sidebarConfig}
      navbarConfig={navbarConfig}
      schema={schema}
      router={router}
      {...props}
    >
      <TestChildren />
    </CannerContainer>
  )
};


describe('<CannerContainer>', () => {
  it('should render children', () => {
    const wrapper = renderComponent();
    expect(wrapper.find(TestChildren).length).toBe(1);
  });

  it('should initial dataChanged state be {}', () => {
    const wrapper = renderComponent();
    expect(wrapper.state('dataChanged')).toEqual({});
  });

  it('should this.menuConfig be sidebarConfig.menuConfig', () => {
    const wrapper = renderComponent();
    expect(wrapper.instance().menuConfig).toEqual(sidebarConfig.menuConfig);
  });

  it('should this.menuConfig be schemaTransformed', () => {
    const wrapper = renderComponent({
      sidebarConfig: {
        menuConfig: true
      }
    });
    expect(wrapper.instance().menuConfig).toEqual(transformedSchemaMenuConfig);
  });

  it('should didDataChange update dataChanged state', () => {
    const goTo = jest.fn();
    const wrapper = renderMountComponent({ goTo });
    const dataChanged = {test: 'test'};
    wrapper.instance().dataDidChange(dataChanged);
    expect(wrapper.state('dataChanged')).toEqual(dataChanged);
  });
});