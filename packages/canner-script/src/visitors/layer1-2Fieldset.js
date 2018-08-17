import { CANNER_KEY } from "../layout";
const visitor = (path) => {
  // first layer block
  if (!path.node.blocks && path.route.split('.').length === 1) {
    const inputChildren = [];
    const imageChildren = [];
    const galleryChildren = [];
    const objectChildren = [];
    const arrayChildren = [];
    const others = [];
    let hasLayout = false;
    path.node.children.forEach((child) => {
      if (child.nodeType === 'layout') {
        hasLayout = true;
      }
      switch (child.type) {
        case 'object':
          objectChildren.push(child);
          break;
        case 'array':
          if (child.items && ['string', 'number', 'boolean'].indexOf(child.items.type) !== -1) {
            inputChildren.push(child);
          } else {
            arrayChildren.push(child);
          }
          break;
        case 'string':
          inputChildren.push(child);
          break;
        case 'dateTime':
          inputChildren.push(child);
          break;
        case 'geoPoint':
          objectChildren.push(child);
          break;
        case 'file':
          objectChildren.push(child);
          break;
        case 'image':
          imageChildren.push(child);
          break;
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
    if (hasLayout) {
      return;
    }
    const inputChildrenWithContainer = inputChildren.length ? [{
      nodeType: 'layout',
      component: "block",
      children: inputChildren,
      childrenName: inputChildren.map((child) => child.name),
      [CANNER_KEY]: inputChildren.reduce((result, child) => {
        result.concat(child[CANNER_KEY] || []);
        return result;
      }, []),
      hocs: ['containerRouter'],
    }] : [];
    const imageChildrenWithContainer = imageChildren.length ? [{
      nodeType: 'layout',
      component: "block",
      children: imageChildren,
      childrenName: imageChildren.map((child) => child.name),
      [CANNER_KEY]: imageChildren.reduce((result, child) => {
        result.concat(child[CANNER_KEY] || []);
        return result;
      }, []),
      hocs: ['containerRouter'],
    }] : [];
    const galleryChildrenWithContainer = galleryChildren.map((child) => ({
      nodeType: 'layout',
      component: "block",
      children: [child],
      [CANNER_KEY]: child[CANNER_KEY],
      childrenName: [child.name],
      hocs: ['containerRouter'],
    }));
    const arrayChildrenWithContainer = arrayChildren.map((child) => ({
      nodeType: 'layout',
      component: "block",
      children: [child],
      [CANNER_KEY]: child[CANNER_KEY],
      childrenName: [child.name],
      hocs: ['containerRouter'],
    }));
    const objectChildrenWithContainer = objectChildren.map((child) => ({
      nodeType: 'layout',
      component: "block",
      description: child.description,
      children: [{...child}],
      childrenName: [child.name],
      [CANNER_KEY]: child[CANNER_KEY],
      hocs: ['containerRouter'],
    }));
    path.tree.setChildren(path.route, [
      ...inputChildrenWithContainer,
      ...imageChildrenWithContainer,
      ...galleryChildrenWithContainer,
      ...objectChildrenWithContainer,
      ...arrayChildrenWithContainer,
      ...others,
    ]);
  }
};

const arrayBlock = {
  'plugins.array': {
    exit: visitor
  }
}
const objectBlock = {
  'plugins.object.fieldset': {
    exit: visitor
  },
};

export default [objectBlock, arrayBlock];
