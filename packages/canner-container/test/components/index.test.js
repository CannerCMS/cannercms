
import * as React from 'react';
import { render, cleanup } from 'react-testing-library';
import 'jest-dom/extend-expect';
import CannerContainer from '../../src/components/index';

afterEach(cleanup);

function TestChildren() {
  return <div data-testid="children">children</div>;
}

const sidebarConfig = {
  logo: 'http://www.img.jpg',
  menuConfig: [{
    title: 'My Info',
    pathname: '/info',
  }, {
    title: 'Posts',
    pathname: '/posts',
  }, {
    title: 'Authors',
    pathname: '/authors',
  }],
};

const navbarConfig = {
  showSaveButton: true,
  renderMenu: jest.fn(),
};

const schema = {
  schema: {
    info: { type: 'object', title: 'My Info', keyName: 'info' },
    posts: { type: 'array', title: 'Posts', keyName: 'posts' },
    users: { type: 'array', title: 'Authors', keyName: 'authors' },
  },
};

const router = {
  getRoutes: jest.fn().mockReturnValue(() => ['1', '2']),
  getPayload: jest.fn(),
  getOperator: jest.fn(),
  getWhere: jest.fn(),
  getSort: jest.fn(),
  getPagination: jest.fn(),
  goTo: jest.fn(),
};

describe('<CannerContainer>', () => {
  it('should render children', () => {
    const { getByTestId } = render(
      <CannerContainer
        sidebarConfig={sidebarConfig}
        navbarConfig={navbarConfig}
        schema={schema}
        router={router}
      >
        <TestChildren />
      </CannerContainer>
    );
    expect(getByTestId('children')).toHaveTextContent('children');
  });

  it('should initial dataChanged state be {}', () => {
    const { getByTestId } = render(
      <CannerContainer
        sidebarConfig={sidebarConfig}
        navbarConfig={navbarConfig}
        schema={schema}
        router={router}
      >
        <TestChildren />
      </CannerContainer>
    );
    expect(getByTestId('navbar-saved-button')).toHaveTextContent('Saved');
  });
});
