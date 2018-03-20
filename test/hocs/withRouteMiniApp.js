/* eslint-disable */

/**
|--------------------------------------------------
| this is just for copy and past
|--------------------------------------------------
*/


import * as React from 'react';
import Enzyme, { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';

const withHOC = () => function HOC() {
  return <div>test</div>;
}
Enzyme.configure({ adapter: new Adapter() });

describe('hocTemplate', () => {
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
    WrapperComponent = withHOC(MockComponent);
  });

  it('should pass', () => {
    expect(true).toBeTruthy();
  });
});