import * as React from 'react';
import Enzyme, {shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16.3';
import RefId from 'canner-ref-id';
import withHOC, {isCompleteContain, genPaths} from '../../src/hocs/route';
import {IntlProvider} from 'react-intl';
import toJson from 'enzyme-to-json';

Enzyme.configure({ adapter: new Adapter() });

describe('genPaths', () => {
  it('should works', () => {
    const pattern = 'array.object.array.string';
    const path = 'info/info/info';
    expect(genPaths(path, pattern)).toEqual(['info', '__ARRAY_INDEX__', 'info', 'info', '__ARRAY_INDEX__']);
  })
});

describe('isCompelete', () => {
  it('should fail', () => {
    const paths = ['info', 'name'];
    const routes = ['info', 'hi'];
    expect(isCompleteContain(paths, routes)).toBeFalsy();
  });

  it('should true', () => {
    const paths = ['info', '__ARRAY_INDEX__'];
    const routes = ['info', 'theisofinfo'];
    expect(isCompleteContain(paths, routes)).toBeTruthy();
  });
});

describe('withRoute', () => {
  let WrapperComponent, props, MockComponent, mockRenderChildren;

  beforeEach(() => {
    MockComponent = function MockComponent() {
      return (<div>Component</div>);
    }
    mockRenderChildren = jest.fn().mockImplementation(() => <div>childre</div>);
    props = {
      refId: new RefId('posts'),
      renderChildren: mockRenderChildren
    }
    WrapperComponent = withHOC(MockComponent);
  });

  it('should not render 1', () => {
    const routes = ['info'];
    const path = 'posts';
    const wrapper = shallow(
      <IntlProvider locale="en">
        <WrapperComponent
          {...props}
          routes={routes}
          path={path}
          pattern="object"
          routerParams={{}}
        />
      </IntlProvider>
    );
    expect(wrapper.find(MockComponent).length).toBe(0);
  });

  it('should not render 2', () => {
    const routes = ['info', 'name'];
    const path = 'info/nickname';
    const wrapper = shallow(
      <IntlProvider>
        <WrapperComponent
          {...props}
          routes={routes}
          path={path}
          pattern="object.string"
          routerParams={{}}
        />
      </IntlProvider>
    );
    expect(wrapper.find(MockComponent).length).toBe(0);
  });

  it('should not render 3', () => {
    const routes = ['posts', 'id1', 'name'];
    const path = 'posts/nickname';
    const wrapper = shallow(
      <IntlProvider>
        <WrapperComponent
          {...props}
          routes={routes}
          path={path}
          pattern="array.string"
          routerParams={{}}
        />
      </IntlProvider>
    );
    expect(wrapper.find(MockComponent).length).toBe(0);
  });

  it('should render 1', () => {
    const routes = ['info'];
    const path = 'info';
    const wrapper = shallow(
      <IntlProvider>
        <WrapperComponent
          {...props}
          routes={routes}
          path={path}
          pattern="object"
          routerParams={{}}
        />
      </IntlProvider>
    );
    expect(wrapper.find(MockComponent).length).toBe(1);
  });

  it('should render 2', () => {
    const routes = ['posts'];
    const path = 'posts';
    const wrapper = shallow(
      <IntlProvider>
        <WrapperComponent
          {...props}
          routes={routes}
          path={path}
          pattern="array"
          routerParams={{}}
        />
      </IntlProvider>
    );
    expect(wrapper.find(MockComponent).length).toBe(1);
  });

  it('should render children 1', () => {
    const routes = ['posts', 'id1'];
    const path = 'posts';
    const wrapper = shallow(
      <IntlProvider>
        <WrapperComponent
          {...props}
          routes={routes}
          path={path}
          pattern="array"
          routerParams={{}}
        />
      </IntlProvider>
    );
    expect(wrapper.find(MockComponent).length).toBe(0);
    expect(mockRenderChildren).toHaveBeenCalledTimes(1);
  });
});