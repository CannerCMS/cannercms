import React from 'react';
import Generator from '../../src/components/Generator';
import renderer from 'react-test-renderer';
import schema from './schema';
import containers from '@canner/react-cms-containers';

/**
 * not working for now
 */

test('Generator', () => {
  const component = renderer.create(
    <Generator
      componentTree={schema.componentTree}
      containers={containers}
      routes={[]}
    />,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();

});