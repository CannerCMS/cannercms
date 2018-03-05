const block = {
  'plugins.object.fieldset': {
    exit: (path) => {
      // third layer fieldset
      if (!path.node.blocks && path.route.split('.').length === 3) {
        const childrenWithRowContainer = path.node.children.map((child) => {
          return {
            nodeType: 'container.row',
            name: child.name,
            children: [child],
            title: child.title,
            navigate: child.nodeType.indexOf('container') !== -1 || child.type === 'object' || child.type === 'array',
            description: child.description,
            childrenName: [child.name],
            hocs: ['containerRouter'],
          };
        });
        const nodeInInnerBlockContainer = {
          nodeType: 'container.innerBlock',
          name: path.node.name,
          children: [{
            ...path.node,
            children: childrenWithRowContainer,
            hideTitle: true,
          }],
          childrenName: [path.node.name],
          title: path.node.title,
          description: path.node.description,
          hocs: ['containerRouter'],
        };
        path.tree.setNode(path.route, nodeInInnerBlockContainer);
      }
    },
  },
};

export default [block];
