import * as React from 'react';
import {configure, mount} from 'enzyme';
import Adapter from './react163Adapter';
import {LiteCMS, Context} from '../src';

configure({
  adapter: new Adapter()
});

describe('LiteCMS', () => {
  let context, MockChildren;

  beforeEach(() => {
    MockChildren = function MockChildren(props) {
      return (
        <div>
          <p className="refId">{props.refId}</p>
          <p className="uiParams">{JSON.stringify(props.uiParams)}</p>
        </div>
      );
    }
    context = {
      renderComponent: jest.fn().mockImplementation((refId, props) => <MockChildren refId={refId} {...props} />),
    }
  });

  it('should pass props', () => {
    const component = mount(<Context.Provider value={context}>
      <LiteCMS refId="refId/0" uiParams={{test: 123}}/>
    </Context.Provider>);
    expect(component.find('.refId').text()).toBe("refId/0");
    expect(component.find('.uiParams').text()).toBe(JSON.stringify({test: 123}));
  });
});