/** @jsx builder */
import Sorter from './toolbar/sorter';

// eslint-disable-next-line
import builder from '../src/index';
import * as React from 'react';
import renderer from 'react-test-renderer';

describe('get react component from canner script', () => {
  it('should works', () => {
    const schema = <toolbar>
      <sorter component={Sorter} />
    </toolbar>;
    const component = renderer.create(React.createElement(schema.sorter.component));
    expect(component.toJSON()).toMatchSnapshot();
  });
});


