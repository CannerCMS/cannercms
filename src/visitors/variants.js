const variants = {
  'plugins.object.variants': {
    enter: (path) => {
      const child = path.node.children.find((child) => child.name === 'variants');
      child.ui = 'panel';
      child.nodeType = 'plugins.array.panel';
      const children = [child];
      path.tree.setChildren(path.route, children);
    },
  },
};

export default [variants];
