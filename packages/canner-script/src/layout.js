
//@flow
import type {CannerSchema, Path} from './flow-types';
export const CANNER_KEY = '__CANNER_KEY__';

export function createLayoutVisitor(attrs: Object, children: Array<CannerSchema>, getCannerKey: () => string = getRandomKey) {
  const {layoutType} = attrs;
  switch (layoutType) {
    case 'injection': {
      // inject value into children node
      return createInjectionLayout(attrs, children, getCannerKey);
    }
    case 'insertion':
    default: {
      // insert node between parent and children;
      return createInsertionLayout(attrs, children, getCannerKey);
    }
  }
}

export function createInsertionLayout(attrs: Object, children: Array<CannerSchema>, getCannerKey: () => string = getRandomKey) {
  if (!children || !children.length) {
    throw new Error('Layout required one child at least');
  }

  const {component, ui, title, description} = attrs;
  if (!component && !ui) {
    throw new Error('Layout should have one of properties `component` and `ui` at least.');
  }

  let cannerKey = getCannerKey();

  // add cannerKey in the children of layout
  children.forEach(child => {
    if (child[CANNER_KEY]) {
      child[CANNER_KEY].push(cannerKey);
    } else {
      child[CANNER_KEY] = [cannerKey];
    }
  })

  const visitor = (path: Path) => {
    const {children} = path.node;
    
    if (!children) return;
    
    if (ui === 'body' && CANNER_KEY in path.node && path.node[CANNER_KEY].indexOf(cannerKey) > -1) {
      // body layout is different from other layout, it just set to the root of tree.
      const layout = {
        ...attrs,
        nodeType: 'layout.body',
        ui: "body",
        children: [path.node]
      };
      path.node.hideTitle = true;
      path.node.inBody = true;
      path.tree.setNode(path.route, layout);
      return;
    }

    // we use cannerKey to find the children should put into the new layout component
    const childrenOfLayout = children.filter(child => {
      return child[CANNER_KEY] && child[CANNER_KEY].indexOf(cannerKey) !== -1;
    });

    // if there is any children is the layout, the component tree don't have to be changed
    if (!childrenOfLayout.length) {
      return;
    }

    // create a layout node with its children
    const layout = {
      ...attrs,
      nodeType: `layout.${attrs.ui}`,
      childrenName: childrenOfLayout.map(child => child.keyName),
      title: title,
      description: description,
      children: childrenOfLayout,
      // concatenate the cannerKeys of children to make this layout can be wrapped by other layouts.
      [CANNER_KEY]: childrenOfLayout.reduce(((result, child) => result.concat(child[CANNER_KEY] || [])), []),
    }
    let meetChildOfLayout = false;
    
    // change the children of the node
    // they should become a layout node and others children node that is not included in the layout node.
    const newChildren = children.reduce((result, child) => {
      // find those excluded children
      if (!child[CANNER_KEY] || child[CANNER_KEY].indexOf(cannerKey) === -1) {
        result.push(child);
      }

      // add the layout node into children and ignore those children including the layout node
      // meetChildOfLayout is used to replace the first included child node with the layout node
      if (!meetChildOfLayout && child[CANNER_KEY] && child[CANNER_KEY].indexOf(cannerKey) !== -1) {
        meetChildOfLayout = true;
        result.push(layout);
      }

      return result;
    }, []);

    // update children
    path.tree.setChildren(path.route, newChildren);
  };
  // layout must exist under the <object>, <array>, and <page>,
  // so check the nodes of these types
  return {
    visitor: {
      'component.object.fieldset': {
        exit: visitor
      },
      'component.array': {
        exit: visitor
      },
      'page.page': {
        exit: visitor
      }
    },
    cannerKey
  }
}

export function createInjectionLayout(attrs: Object, children: Array<CannerSchema>, getCannerKey: () => string = getRandomKey) {
  if (!children || !children.length) {
    throw new Error('Layout required one child at least');
  }

  const {injectValue} = attrs;

  if (!injectValue) {
    throw new Error('Injection Layout need a injectValue');
  }

  const cannerKey = getCannerKey();

  // add cannerKey in the children of layout
  children.forEach(child => {
    if (child[CANNER_KEY]) {
      child[CANNER_KEY].push(cannerKey);
    } else {
      child[CANNER_KEY] = [cannerKey];
    }
  })

  const visitor = function(path) {
    if (!path.node[CANNER_KEY] || path.node[CANNER_KEY].indexOf(cannerKey) === -1) {
      return ;
    }
    Object.keys(injectValue).forEach(key => {
      path.node[key] = injectValue[key];
    });
  }
  const allVisitor = children.reduce((result, child) => {
    if (`component.${child.type}` in result) {
      return result;
    }

    result[`component.${child.type}`] = visitor;
    return result;
  }, {});

  return {
    visitor: allVisitor,
    cannerKey
  }
}

export function getRandomKey() {
  return Math.random().toString(36).substr(2, 10);
}
