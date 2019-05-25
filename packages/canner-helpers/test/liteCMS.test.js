import * as React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { LiteCMS, Context } from '../src';

configure({
  adapter: new Adapter(),
});

describe('LiteCMS', () => {
  let context;
  let MockChildren;

  beforeEach(() => {
    MockChildren = function MockChildren(props) {
      const { refId, uiParams } = props;
      return (
        <div>
          <p className="refId">{refId}</p>
          <p className="uiParams">{JSON.stringify(uiParams)}</p>
        </div>
      );
    };
    context = {
      renderComponent: jest.fn().mockImplementation((refId, props) => <MockChildren refId={refId} {...props} />),
    };
  });

  it('should pass props', () => {
    const component = mount(
      <Context.Provider value={context}>
        <LiteCMS refId="refId/0" uiParams={{ test: 123 }} />
      </Context.Provider>
    );
    expect(component.find('.refId').text()).toBe('refId/0');
    expect(component.find('.uiParams').text()).toBe(JSON.stringify({ test: 123 }));
  });
});
