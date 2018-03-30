/**
|--------------------------------------------------
| this is just for copy and past
|--------------------------------------------------
*/


import * as React from 'react';
import Enzyme, { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';
import withRoute from '../../src/hocs/withRoute';
import {fromJS} from 'immutable';
import { UNIQUE_ID } from '../../src/app/config';
import RefId from 'canner-ref-id';

Enzyme.configure({ adapter: new Adapter() });

describe('withRoute', () => {
  let WrapperComponent, MockComponent, mockRenderChildren;

  beforeEach(() => {
    MockComponent = function MockComponent() {
      return (<div>Component</div>);
    }
    mockRenderChildren = jest.fn().mockImplementation(() => <div>children</div>);
    WrapperComponent = withRoute(MockComponent);
  });

  it('should render', () => {
    const mockFetch = jest.fn().mockImplementation(() => Promise.resolve());
    const wrapper = shallow(<WrapperComponent
      type="string"
      routes={['info', 'name']}
      rootValue={fromJS({
        name: 'Name'
      })}
      name="name"
      refId={new RefId("info/name")}
      params={{}}
      renderChildren={mockRenderChildren}
      fetch={mockFetch}
    />);
    expect(toJson(wrapper)).toMatchSnapshot();
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('normal render when routes = []', () => {
    const mockFetch = jest.fn().mockImplementation(() => Promise.resolve());
    const wrapper = shallow(<WrapperComponent
      type="string"
      routes={[]}
      rootValue={fromJS({
        name: 'Name'
      })}
      name="name"
      refId={new RefId("info/name")}
      params={{}}
      renderChildren={mockRenderChildren}
      fetch={mockFetch}
    />);
    return wrapper.instance().updateState().then(() => {
      expect(wrapper.instance().state).toMatchObject({
        renderType: 0,
        canRender: true,
        restRoutes: []
      });
    });
  });

  it('normal render when routes = [selfName]', () => {
    const mockFetch = jest.fn().mockImplementation(() => Promise.resolve());
    const wrapper = shallow(<WrapperComponent
      type="string"
      routes={['name']}
      rootValue={fromJS({
        name: 'Name'
      })}
      name="name"
      refId={new RefId("info/name")}
      params={{}}
      renderChildren={mockRenderChildren}
      fetch={mockFetch}
    />);
    return wrapper.instance().updateState().then(() => {
      expect(wrapper.instance().state).toMatchObject({
        renderType: 0,
        canRender: true,
        restRoutes: []
      });
    });
  });

  it('render children when routes = [selfName, recordId], array type', () => {
    const mockFetch = jest.fn().mockImplementation(() => Promise.resolve());
    const wrapper = shallow(<WrapperComponent
      type="array"
      routes={['posts', 'post1']}
      rootValue={fromJS([{
        [UNIQUE_ID]: 'post1',
        title: 'Title'
      }])}
      name="posts"
      refId={new RefId("posts")}
      params={{}}
      fetch={mockFetch}
      renderChildren={mockRenderChildren}
    />);
    return wrapper.instance().updateState().then(() => {
      expect(wrapper.instance().state).toMatchObject({
        renderType: 1,
        canRender: true,
        restRoutes: []
      });
    });
  });

  it('render children when routes = [selfName], array type, create operation', () => {
    const mockFetch = jest.fn().mockImplementation(() => Promise.resolve());
    const wrapper = shallow(<WrapperComponent
      type="array"
      routes={['posts']}
      rootValue={fromJS([{
        [UNIQUE_ID]: 'post1',
        title: 'Title'
      }])}
      name="posts"
      refId={new RefId("posts")}
      params={{op: 'create'}}
      fetch={mockFetch}
      renderChildren={mockRenderChildren}
    />);
    return wrapper.instance().updateState().then(() => {
      expect(wrapper.instance().state).toMatchObject({
        renderType: 1,
        canRender: true,
        restRoutes: []
      });
    });
  });
});