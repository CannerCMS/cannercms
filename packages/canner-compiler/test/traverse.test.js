import isArray from 'lodash/isArray';
import Traverser from '../src/traverser';
// import c from '../src/canner-node';

let tree = {};
let traverser;
beforeEach(() => {
  tree = {
    info: {
      name: 'info',
      nodeType: 'component.object.fieldset',
      type: 'object',
      items: {
        name: {
          type: 'string',
          ui: 'input',
        },
      },
      blocks: [
        { leftKeys: ['name'], rightKeys: [] },
      ],
      children: [{
        name: 'name',
        type: 'string',
        ui: 'input',
        nodeType: 'component.string.input',
      }],
    },
    info2: {
      name: 'info2',
      nodeType: 'component.object.fieldset',
      type: 'object',
      items: {
        name: {
          type: 'string',
          ui: 'input',
        },
      },
      blocks: [
        { leftKeys: [], rightKeys: ['name'] },
      ],
      children: [{
        name: 'name',
        type: 'string',
        ui: 'input',
        nodeType: 'component.string.input',
      }],
    },
  };
  traverser = new Traverser(tree);
});

describe('PackageName', () => {
  it('vistor queue', () => {
    const fn = jest.fn();
    const visitor = {
      'component.string.input': fn,
    };
    traverser.addVisitor(visitor);
    traverser.addVisitor(visitor);
    traverser.addVisitor(visitor);
    traverser.traverse();
    expect(fn).toHaveBeenCalledTimes(6);
  });

  it('vistor order', () => {
    const traversePath = [];
    const visitor = {
      component: {
        enter: (path) => {
          traversePath.push({
            [path.node.name]: 'enter',
          });
        },
        exit: (path) => {
          traversePath.push({
            [path.node.name]: 'exit',
          });
        },
      },
    };
    traverser.addVisitor(visitor);
    traverser.traverse();
    expect(traversePath).toEqual([
      { info: 'enter' },
      { name: 'enter' },
      { name: 'exit' },
      { info: 'exit' },
      { info2: 'enter' },
      { name: 'enter' },
      { name: 'exit' },
      { info2: 'exit' },
    ]);
  });

  it('node name should change', () => {
    const visitor = {
      'component.object.fieldset': (path) => {
        path.node.name = 'test';
      },
    };
    const newTree = { ...tree };
    newTree.info.name = 'test';
    traverser.addVisitor(visitor);
    expect(traverser.traverse())
      .toEqual(newTree);
  });

  it('route should update if first slibings change', () => {
    tree.info.children.push({
      name: 'name2',
      type: 'string',
      ui: 'input',
      nodeType: 'component.string.input',
    });
    tree.info.children.push({
      name: 'name3',
      type: 'string',
      ui: 'input',
      nodeType: 'component.string.input',
    });
    traverser = new Traverser(tree);
    const visitor = {
      'component.string.input': (path) => {
        if (path.route === 'info.0') {
          const bro = path.tree.getSiblingNodes(path.route).down;
          path.tree.setChildren(path.route.split('.').slice(0, -1).join('.'), [path.node, bro[1]]);
        }
      },
    };
    const mockChildren3Action = jest.fn();
    const visitor2 = {
      'component.string.input': (path) => {
        if (path.route === 'info.2') {
          mockChildren3Action();
        }
      },
    };
    const newTree = { ...tree };
    newTree.info.name = 'test';
    traverser.addVisitor(visitor);
    traverser.addVisitor(visitor2);
    traverser.traverse();
    expect(mockChildren3Action)
      .not
      .toHaveBeenCalled();
  });

  // it('route should update if second slibings change', function() {
  //   tree.info.children.push({
  //     name: "name2",
  //     type: "string",
  //     ui: "input",
  //     nodeType: "component.string.input"
  //   });
  //   tree.info.children.push({
  //     name: "name3",
  //     type: "string",
  //     ui: "input",
  //     nodeType: "component.string.input"
  //   });
  //   traverser = new Traverser(tree);
  //   const visitor = {
  //     "component.string.input": path => {
  //       if (path.route === 'info.1') {
  //         const topBro = path.tree.getSiblingNodes(path.route).top;
  //         path.tree.setChildren(path.route.split('.').slice(0, -1).join('.'), [topBro[0], path.node]);
  //       }
  //     }
  //   };
  //   const mockChildren3Action = jest.fn();
  //   const visitor2 = {
  //     "component.string.input": path => {
  //       if (path.route === 'info.1') {
  //         mockChildren3Action();
  //       }
  //     }
  //   };
  //   const newTree = {...tree};
  //   newTree.info.name = "test";
  //   traverser.addVisitor(visitor);
  //   traverser.addVisitor(visitor2);
  //   traverser.traverse();
  //   expect(mockChildren3Action)
  //     .toHaveBeenCalledTimes(2);
  // });

  it('should add children', () => {
    const newNode = {
      name: 'address',
      type: 'string',
      ui: 'input',
      nodeType: 'component.string.input',
    };
    const visitor = {
      'component.object.fieldset': (path) => {
        path.node.name = 'test';
        path.tree.pushChildren(path.route, newNode);
      },
    };
    const newTree = { ...tree };
    newTree.info.children.push(newNode);
    traverser.addVisitor(visitor);
    expect(traverser.traverse())
      .toEqual(newTree);
  });

  it('add decorators for all plugin', () => {
    const visitor = {
      component: (path) => {
        if (isArray(path.node.decorators)) {
          path.node.decorators.push('title');
        } else {
          path.node.decorators = ['title'];
        }
      },
    };
    traverser.addVisitor(visitor);
    const newTree = traverser.traverse();
    function checkNode(node) {
      if (node.nodeType && node.nodeType.indexOf('component') !== -1) {
        expect(node.decorators.length).toBe(1);
      }
      if (node.children) {
        node.children.forEach(node => checkNode(node));
      }
    }
    checkNode(newTree);
  });

  it('wrap the block container on children', () => {
    const visitor = {
      'component.object': (path) => {
        const children = path.node.children;
        // has the setting
        if (path.node.blocks) {
          const childrenWithContainers = path.node.blocks.map((block) => {
            const keys = block.leftKeys.concat(block.rightKeys);
            return {
              nodeType: 'container.block',
              leftKeys: block.leftKeys,
              rightKeys: block.rightKeys,
              children: children.filter(child => keys.indexOf(child.name) !== -1),
            };
          });
          path.tree.setChildren(path.route, childrenWithContainers);
        }
      },
    };
    traverser.addVisitor(visitor);
    traverser.traverse();
    // the second child is the container I add in visitor above
    expect(tree.info.children[0].children.length).toBe(1);
    expect(tree.info2.children[0].children.length).toBe(1);
  });

  it('wrap the block container on children', () => {
    const visitor = {
      'component.object': (path) => {
        const children = path.node.children;
        // has the setting
        if (path.node.blocks) {
          const childrenWithContainers = path.node.blocks.map((block) => {
            const keys = block.leftKeys.concat(block.rightKeys);
            return {
              nodeType: 'container.block',
              leftKeys: block.leftKeys,
              rightKeys: block.rightKeys,
              children: children.filter(child => keys.indexOf(child.name) !== -1),
            };
          });
          path.tree.setChildren(path.route, childrenWithContainers);
        }
      },
    };
    traverser.addVisitor(visitor);
    traverser.traverse();
    // the second children is the container I add in visitor above
    expect(tree.info.children[0].children.length).toBe(1);
    expect(tree.info2.children[0].children.length).toBe(1);
  });
});
