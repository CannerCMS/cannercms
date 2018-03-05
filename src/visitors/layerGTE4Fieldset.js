const block = {
  'plugins.object.fieldset': {
    exit: (path) => {
      // third layer fieldset
      if (!path.node.blocks && path.route.split('.').length >= 4) {
        const nodeInInnerBlockContainer = {
          nodeType: 'container.default',
          style: {background: '#fff', padding: 16},
          name: path.node.name,
          children: [path.node],
          childrenName: [path.node.name],
          title: path.node.title,
          description: path.node.description,
          hocs: [],
        };
        path.tree.setNode(path.route, nodeInInnerBlockContainer);
      }
    },
  },
};

export default [block];
