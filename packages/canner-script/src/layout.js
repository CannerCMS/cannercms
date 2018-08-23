
//@flow
import type {CannerSchema, Path} from './flow-types';
export const CANNER_KEY = '__CANNER_KEY__';


export function createLayoutVisitor(attrs: Object, children: Array<CannerSchema>, getCannerKey: () => string = getRandomKey) {
  const {layoutType} = attrs;
  switch (layoutType) {
    case 'injection': {
      return createInjectionLayout(attrs, children, getCannerKey);
    }
    case 'insertion':
    default: {
      return createInsertionLayout(attrs, children, getCannerKey);
    }
  }
}

export function createInsertionLayout(attrs: Object, children: Array<CannerSchema>, getCannerKey: () => string = getRandomKey) {
  if (!children || !children.length) {
    throw new Error('Layout required one child at least');
  }

  const {component, title, description} = attrs;
  if (!component) {
    throw new Error('Layout should have the property `component`');
  }

  let cannerKey = getCannerKey();
  const visitor = (path: Path) => {
    const {children} = path.node;
    
    if (!children) return;
    
    const childrenOfLayout = children.filter(child => {
      return child[CANNER_KEY] && child[CANNER_KEY].indexOf(cannerKey) !== -1;
    });
    if (!childrenOfLayout.length) {
      return;
    }
    const layout = {
      ...attrs,
      nodeType: 'layout',
      name: childrenOfLayout[0].keyName,
      childrenName: childrenOfLayout.map(child => child.keyName),
      title: title,
      description: description,
      children: childrenOfLayout,
      hocs: ['containerRouter'],
      [CANNER_KEY]: childrenOfLayout.reduce(((result, child) => result.concat(child[CANNER_KEY] || [])), []),
    }
    let meetChildOfLayout = false;
    const newChildren = children.reduce((result, child) => {
      if (!child[CANNER_KEY] || child[CANNER_KEY].indexOf(cannerKey) === -1) {
        result.push(child);
      }

      if (!meetChildOfLayout && child[CANNER_KEY] && child[CANNER_KEY].indexOf(cannerKey) !== -1) {
        meetChildOfLayout = true;
        result.push(layout);
      }

      return result;
    }, []);

    path.tree.setChildren(path.route, newChildren);
  };
  return {
    visitor: {
      'component.object.fieldset': {
        exit: visitor
      },
      'component.array': {
        exit: visitor
      }
      // [`component.${lastChild.type}`]: {
      //   exit: path => {
      //     if (path.route.split('.').length <= 1 || path.node.keyName !== lastChild.keyName || !path.node[CANNER_KEY] || path.node[CANNER_KEY].indexOf(cannerKey) === -1) {
      //       return;
      //     }
      //     const currentNode = path.tree.getNode(path.route);
      //     const siblingsObj = path.tree.getSiblingNodes(path.route);
      //     const siblingsBecomeChildren = siblingsObj.top.filter(node => node[CANNER_KEY] && node[CANNER_KEY].indexOf(cannerKey) !== -1);
      //     const leftSiblings = siblingsObj.top.filter(node => !node[CANNER_KEY] || node[CANNER_KEY].indexOf(cannerKey) === -1);
      //     const newChildren = [...siblingsBecomeChildren, currentNode];
      //     const componentInLayout = [...leftSiblings, {
      //       nodeType: 'layout',
      //       name: newChildren[0].keyName,
      //       component: name,
      //       childrenName: newChildren.map(child => child.keyName),
      //       title: title || newChildren[0].title,
      //       description: description || newChildren[0].description,
      //       children: newChildren,
      //       hocs: ['containerRouter'],
      //       [CANNER_KEY]: newChildren.reduce(((result, child) => result.concat(child[CANNER_KEY] || [])), []),
      //     }, ...siblingsObj.down];
      //     path.tree.setChildren(path.route.split('.').slice(0, -1).join('.'), componentInLayout);
      //   }
      // }
    },
    cannerKey
  }
}

export function createInjectionLayout(attrs: Object, children: Array<CannerSchema>, getCannerKey: () => string = getRandomKey) {
  if (!children || !children.length) {
    throw new Error('Layout required one child at least');
  }

  const {name, injectValue} = attrs;

  if (!name) {
    throw new Error('Layout required a name');
  }

  if (!injectValue) {
    throw new Error('Injection Layout need a injectValue');
  }


  const cannerKey = getCannerKey();
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
