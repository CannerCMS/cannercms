/** @jsx builder */
import * as React from 'react';
import renderer from 'react-test-renderer';
import Sorter from './toolbar/sorter';

// eslint-disable-next-line
import builder from '../src/index';

describe('get react component from canner script', () => {
  it('should works', () => {
    const schema = (
      <toolbar>
        <sorter component={Sorter} />
      </toolbar>
    );
    const component = renderer.create(React.createElement(schema.sorter.component));
    expect(component.toJSON()).toMatchSnapshot();
  });
});
