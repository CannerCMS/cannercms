import { findNode } from '../../src/components/Generator';

describe('renderComponnet', () => {
  it('findNode should work', () => {
    const node = {
      nodeType: 'layout',
      children: [{
        nodeType: 'layout',
        component: 'block',
        children: [{
          nodeType: 'component.object',
          keyName: 'info',
          children: [{
            nodeType: 'layout',
            keyName: 'name',
            children: [{
              nodeType: 'component.string',
              keyName: 'name',
            }],
          }],
        }],
      }],
    };
    const pathArr = ['info', 'name'];
    expect(findNode(pathArr, node)).toEqual({
      nodeType: 'component.string',
      keyName: 'name',
    });
  });
});
