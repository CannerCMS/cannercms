/** @jsx builder */
import Sort from './toolbar/sort';

// eslint-disable-next-line
import builder from '../src/index';
import * as React from 'react';
import renderer from 'react-test-renderer';

describe('get react component from canner script', () => {
  it('should works', () => {
    const schema = <toolbar>
      <sort component={Sort} />
    </toolbar>;
    const component = renderer.create(React.createElement(schema.sort.component));
    expect(component.toJSON()).toMatchSnapshot();
  });
});


