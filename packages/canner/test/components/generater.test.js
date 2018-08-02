import Generator from '../../src/components/Generator';

describe('renderComponnet', () => {
  it('findNode should work', () => {
    const node = {
      nodeType: 'layout',
      children: [{
        nodeType: 'layout',
        component: 'block',
        children: [{
          nodeType: 'plugins.object',
          keyName: 'info',
          children: [{
            nodeType: 'layout',
            keyName: 'name',
            children: [{
              nodeType: 'plugins.string',
              keyName: 'name'
            }]
          }]
        }]
      }]
    };
    const pathArr = ['info', 'name'];
    expect(Generator.findNode(pathArr, node)).toEqual({
      nodeType: 'plugins.string',
      keyName: 'name'
    });
  });
});