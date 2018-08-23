import Tree from '../src/tree';

let tree = {};
let ast = {};
beforeEach(() => {
  ast = {
    info: {
      name: 'info',
      nodeType: 'component.object.fieldset',
      children: [{
        name: 'name1',
        nodeType: 'component.string.input',
      }, {
        name: 'name2',
        nodeType: 'component.string.input',
      }, {
        name: 'name3',
        nodeType: 'component.string.input',
      }],
    },
  };
  tree = new Tree(ast);
});

describe('get node from tree', function() {
  it('get node', function() {
    expect(tree.getNode('info.0'))
      .toEqual(ast.info.children[0]);
  });
  it('get path', function() {
    expect(tree.getPath('info.0'))
      .toMatchObject({
        parent: ast.info,
        node: ast.info.children[0],
      });
  });
  it('get parent', function() {
    expect(tree.getParentNode('info.0'))
      .toEqual(ast.info);
  });

  it('get sibling', function() {
    expect(tree.getSiblingNodes('info.1'))
      .toEqual({
        top: [ast.info.children[0]],
        down: [ast.info.children[2]],
      });
  });

  it('get ancestry', function() {
    expect(tree.getAncestryNodes('info.0'))
      .toEqual([ast, ast.info]);
  });

  it('get ancestry from', function() {
    expect(tree.getAncestryNodesFrom('info.0', (node) => {
      return node.name === 'info';
    }))
      .toEqual([ast.info]);
  });
});

describe('edit node', function() {
  it('set node', function() {
    const newTree = {...ast};
    const newNode = {
      name: 'address',
      nodeType: 'component.string.input',
    };
    newTree.info.children[0] = newNode;
    expect(tree.setNode('info.0', newNode).getTree())
      .toEqual(newTree);
  });
  it('setChildren', function() {
    const newTree = {...ast};
    const newNodes = [{
      name: 'address',
      nodeType: 'component.string.input',
    }];
    newTree.info.children = newNodes;
    expect(tree.setChildren('info', newNodes).getTree())
      .toEqual(newTree);
  });
  it('injectChildren', function() {
    expect(tree.injectChildren('info', {nice: true}).getTree().info.children[0].nice)
      .toBe(true);
  });
  it('remove node', function() {
    const newTree = {...ast};
    newTree.info.children.shift();
    expect(tree.removeNode('info.0').getTree())
      .toEqual(newTree);
  });

  it('push children', function() {
    const newTree = {...ast};
    const newNode = {
      name: 'address',
      nodeType: 'component.string.input',
    };
    newTree.info.children.push(newNode);
    expect(tree.pushChildren('info', newNode).getTree())
      .toEqual(newTree);
  });
  it('unshift children', function() {
    const newTree = {...ast};
    const newNode = {
      name: 'address',
      nodeType: 'component.string.input',
    };
    newTree.info.children.unshift(newNode);
    expect(tree.unshiftChildren('info', newNode).getTree())
      .toEqual(newTree);
  });
});
