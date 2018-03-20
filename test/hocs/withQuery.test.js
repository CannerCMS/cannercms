/**
|--------------------------------------------------
| this is just for copy and past
|--------------------------------------------------
*/


import * as React from 'react';
import Enzyme, { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';
import withQuery from '../../src/hocs/withQuery';
import {fromJS} from 'immutable';

Enzyme.configure({ adapter: new Adapter() });

describe('with Query', () => {
  let WrapperComponent, props, MockComponent;

  beforeEach(() => {
    MockComponent = function MockComponent() {
      return (<div>Component</div>);
    }
    props = {
      id: 'info',
    }
    WrapperComponent = withQuery(MockComponent);
  });

  it('should render', () => {
    const wrapper = shallow(<WrapperComponent {...props} />, {
      context: {
        fetch: () => Promise.resolve({response: {body: fromJS({
          name: 'Name'
        })}}),
        subscribe: () => Promise.resolve()
      }
    });
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});