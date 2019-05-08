import * as React from 'react';
import {render, cleanup} from 'react-testing-library';
import {Item, Context} from '../src';
import 'jest-dom/extend-expect';
afterEach(cleanup);

describe('children', () => {
  let context, MockChildren;

  beforeEach(() => {
    MockChildren = function MockChildren(props) {
      return (
        <div>
          <p data-testid="refId">{props.refId}</p>
          <p data-testid="routes">{JSON.stringify(props.routes)}</p>
        </div>
      );
    }
    const node = {
      children: [{
        keyName: 'child1'
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
    const {getByTestId} = render(
      <Context.Provider value={context}>
        <Item />
      </Context.Provider>
    );
    expect(getByTestId('refId')).toHaveTextContent('refId');
    expect(getByTestId('routes')).toHaveTextContent('routes');
  });

  it('should overwrite props', () => {
    const {getByTestId} = render(<Context.Provider value={context}>
      <Item refId="refId/0" routes={[]}/>
    </Context.Provider>);
    expect(getByTestId('refId')).toHaveTextContent('refId/0');
    expect(getByTestId('routes')).toHaveTextContent('[]');
  });

  it('should hidden', () => {
    const {queryByTestId} = render(<Context.Provider value={context}>
      <Item refId="refId/0" routes={[]} filter={node => node.keyName === 'child0'}/>
    </Context.Provider>);
    expect(queryByTestId('refId')).toBe(null);
    expect(queryByTestId('routes')).toBe(null);
  });
});