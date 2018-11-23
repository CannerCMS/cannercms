import * as React from 'react';
import {configure, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {ResetButton, Context} from '../src';

configure({
  adapter: new Adapter()
});

describe('cancel button', () => {
  let context, MockChildren;

  beforeEach(() => {
    MockChildren = function MockChildren(props) {
      return (
        <button>
          <p className="refId">{props.refId}</p>
        </button>
      );
    }
    context = {
      renderCancelButton: jest.fn().mockImplementation(props => <MockChildren {...props} />),
      refId: 'refId',
    }
  });

  it('should render, has default refId', () => {
    const component = mount(
      <Context.Provider value={context}>
        <ResetButton />
      </Context.Provider>
    );
    expect(component.find('.refId').text()).toBe(context.refId);
  });

  it('should pass props', () => {
    const component = mount(<Context.Provider value={context}>
      <ResetButton refId="refId/0"/>
    </Context.Provider>);
    expect(component.find('.refId').text()).toBe("refId/0");
  });
});