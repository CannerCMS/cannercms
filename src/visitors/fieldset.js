
const layout = {
  'plugins.object.fieldset': {
    exit: (path) => {
      if (path.node.layout) {
        path.tree.injectChildren(path.route, {layout: path.node.layout});
        path.node.layout = undefined;
      }
    },
  },
};
const collapse = {
  'plugins.object.fieldset': {
    exit: (path) => {
      if (path.node.collapse) {
        const childrenWithContainers = {
          nodeType: 'container.collapse',
          children: path.node.children,
          title: path.node.title,
        };
        path.node.hideTitle = true;
        path.tree.setChildren(path.route, childrenWithContainers);
      }
    },
  },
};

const block = {
  'plugins.object.fieldset': {
    exit: (path) => {
      const children = path.node.children;
      if (path.node.blocks) {
        const childrenWithContainers = path.node.blocks.map((block) => {
          const leftChildren = children.filter((child) => block.leftKeys && block.leftKeys.indexOf(child.name) !== -1);
          const rightChildren = children.filter((child) => block.rightKeys && block.rightKeys.indexOf(child.name) !== -1);
          const blockChildren = [];
          if (leftChildren.length > 0) {
            blockChildren.push({
              nodeType: 'container.default',
              children: leftChildren,
            });
          }
          if (rightChildren.length > 0) {
            blockChildren.push({
              nodeType: 'container.default',
              children: rightChildren,
              style: {
                marginLeft: 30,
              },
            });
          }
          return {
            nodeType: 'container.block',
            children: blockChildren,
          };
        });
        path.tree.setChildren(path.route, childrenWithContainers);
      }
    },
  },
};

export default [layout, collapse, block];
