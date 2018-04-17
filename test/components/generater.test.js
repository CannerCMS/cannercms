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
      layouts={{}}
      routes={[Object.keys(schema.cannerSchema)[0]]}
    />,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

describe('renderComponnet', () => {
  it('findNode should work', () => {
    const node = {
      nodeType: 'layout',
      children: [{
        nodeType: 'layout',
        component: 'block',
        children: [{
          nodeType: 'plugins.object',
          name: 'info',
          children: [{
            nodeType: 'layout',
            name: 'name',
            children: [{
              nodeType: 'plugins.string',
              name: 'name'
            }]
          }]
        }]
      }]
    };
    const pathArr = ['info', 'name'];
    expect(Generator.findNode(pathArr, node)).toEqual({
      nodeType: 'plugins.string',
      name: 'name'
    });
  });
});