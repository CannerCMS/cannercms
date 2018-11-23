import * as React from 'react';
import {configure, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {Item, Context} from '../src';

configure({
  adapter: new Adapter()
});

describe('children', () => {
  let context, MockChildren;

  beforeEach(() => {
    MockChildren = function MockChildren(props) {
      return (
        <div>
          <p className="refId">{props.refId}</p>
          <p className="routes">{JSON.stringify(props.routes)}</p>
        </div>
      );
    }
    const node = {
      children: [{
        keyName: 'child1'
      }, {
        keyName: 'child2'
      }]
    }
    context = {
      renderChildren: jest.fn().mockImplementation(props => {
        return node.children.map((child, i) => {
          let childrenProps = props;
          if (typeof props === 'function') {
            childrenProps = props(child);
          }
          if (childrenProps.hidden) return null;
          return <MockChildren key={i} {...childrenProps} />
        });
      }),
      refId: 'refId',
      routes: ['routes'],
    }
  });

  it('should render, has refId and routes', () => {
    const component = mount(
      <Context.Provider value={context}>
        <Item />
      </Context.Provider>
    );
    expect(component.find('.refId').length).toBe(2);
    expect(component.find('.routes').length).toBe(2);
  });

  it('should pass props', () => {
    const component = mount(<Context.Provider value={context}>
      <Item refId="refId/0" routes={[]}/>
    </Context.Provider>);
    expect(component.find('.refId').length).toBe(2);
    expect(component.find('.routes').length).toBe(2);
  });

  it('should hidden', () => {
    const component = mount(<Context.Provider value={context}>
      <Item refId="refId/0" routes={[]} filter={node => node.keyName === 'child1'}/>
    </Context.Provider>);
    expect(component.find('.refId').length).toBe(1);
    expect(component.find('.routes').length).toBe(1);
  });
});