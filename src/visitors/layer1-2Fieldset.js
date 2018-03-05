const block = {
  'plugins.object.fieldset': {
    exit: (path) => {
      // first layer block
      if (!path.node.blocks && path.route.split('.').length === 1) {
        const inputChildren = [];
        const imageChildren = [];
        const galleryChildren = [];
        const editorChildren = [];
        const objectChildren = [];
        const arrayChildren = [];
        const others = [];
        path.node.children.forEach((child) => {
          switch (child.type) {
            case 'object':
              objectChildren.push(child);
              break;
            case 'array':
              if (child.ui === 'gallery') {
                galleryChildren.push(child);
              } else if (child.ui === 'tag') {
                inputChildren.push(child);
              } else {
                arrayChildren.push(child);
              }
              break;
            case 'string': {
              if (child.ui === 'editor') {
                editorChildren.push(child);
              } else if (child.ui === 'image') {
                imageChildren.push(child);
              } else {
                inputChildren.push(child);
              }
              break;
            }
            case 'relation':
              inputChildren.push(child);
              break;
            case 'number':
              inputChildren.push(child);
              break;
            case 'boolean':
              inputChildren.push(child);
              break;
            default:
              others.push(child);
              break;
          }
        });
        const inputChildrenWithContainer = inputChildren.length ? [{
          nodeType: 'container.block',
          name: `[block-${getRandomString()}]`,
          children: inputChildren,
          childrenName: inputChildren.map((child) => child.name),
          hocs: ['containerRouter'],
        }] : [];
        const imageChildrenWithContainer = imageChildren.length ? [{
          nodeType: 'container.block',
          name: `[block-${getRandomString()}]`,
          children: imageChildren,
          childrenName: imageChildren.map((child) => child.name),
          hocs: ['containerRouter'],
        }] : [];
        const editorChildrenWithContainer = editorChildren.map((child) => ({
          nodeType: 'container.block',
          title: child.title,
          description: child.description,
          name: `[block-${getRandomString()}]`,
          children: [{...child, hideTitle: true}],
          childrenName: [child.name],
          hocs: ['containerRouter'],
        }));
        const galleryChildrenWithContainer = galleryChildren.map((child) => ({
          nodeType: 'container.block',
          name: `[block-${getRandomString()}]`,
          children: [child],
          childrenName: [child.name],
          hocs: ['containerRouter'],
        }));
        const arrayChildrenWithContainer = arrayChildren.map((child) => ({
          nodeType: 'container.block',
          name: `[block-${getRandomString()}]`,
          children: [child],
          childrenName: [child.name],
          hocs: ['containerRouter'],
        }));
        const objectChildrenWithContainer = objectChildren.map((child) => ({
          nodeType: 'container.block',
          title: child.title,
          description: child.description,
          name: `[block-${getRandomString()}]`,
          children: [{...child, hideTitle: true}],
          childrenName: [child.name],
          hocs: ['containerRouter'],
        }));
        path.tree.setChildren(path.route, [
          ...inputChildrenWithContainer,
          ...editorChildrenWithContainer,
          ...imageChildrenWithContainer,
          ...galleryChildrenWithContainer,
          ...objectChildrenWithContainer,
          ...arrayChildrenWithContainer,
          ...others,
        ]);
      }
    },
  },
};

function getRandomString() {
  return Math.random().toString(36).substr(2, 5);
}

export default [block];
