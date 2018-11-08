

import * as React from 'react';
import {get} from 'lodash';
import Enzyme, { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';
import withOnDeploy, {getValueAndPaths} from '../../src/hocs/onDeploy';
import RefId from 'canner-ref-id';

Enzyme.configure({ adapter: new Adapter() });

describe('getValueAndPaths', () => {
  it('should works', () => {
    const rootValue = {
      posts: {
        edges: [{
          cursor: 'id1',
          node: {
            id: 'id1',
            images: [{
              url: 'url1'
            }]
          }
        }],
        pageInfo: {
          hasNextInfo: false
        }
      }
    };

    const idPathArr = ['posts', '0', 'images', '0', 'url'];
    expect(getValueAndPaths(get(rootValue, ['posts', 'edges', '0', 'node']), idPathArr.slice(2))).toEqual({
      value: 'url1',
      paths: ['images', '0', 'url']
    });
  });
});

describe('withOnDeploy', () => {
  let WrapperComponent, props, MockComponent, mockOnDeploy, mockRemoveOnDeploy;

  beforeEach(() => {
    MockComponent = function MockComponent() {
      return (<div>Component</div>);
    }

    mockOnDeploy = jest.fn();
    mockRemoveOnDeploy = jest.fn();

    props = {
      refId: new RefId('posts/0/images/0/url'),
      pattern: 'array.array.string',
      onDeploy: mockOnDeploy,
      removeOnDeploy: mockRemoveOnDeploy,
      rootValue: {
        posts:[{
          id: 'id1',
          images: [{
            url: 'url1'
          }]
        }]
      },
  
    }

    WrapperComponent = withOnDeploy(MockComponent);
  });

  it('should render', () => {
    const wrapper = mount(
        <WrapperComponent
          {...props}
        />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should onDeploy works', () => {
    const wrapper = mount(
      <WrapperComponent
        {...props}
      />
    );
    const callback = jest.fn().mockImplementation(() => {
      return 'new url';
    });

    wrapper.instance().onDeploy(callback);
    expect(mockOnDeploy.mock.calls[0][0]).toBe('posts');
    expect(typeof mockOnDeploy.mock.calls[0][1]).toBe('function');
    expect(mockOnDeploy.mock.calls[0][1]({data: get(props.rootValue, ['posts', 0])})).toMatchSnapshot();
    expect(callback).toHaveBeenCalledTimes(1);
  });
});