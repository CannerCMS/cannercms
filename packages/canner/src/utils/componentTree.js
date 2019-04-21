// @flow
import React from 'react'
import {
  mapValues,
  get,
} from 'lodash';

import Loadable from 'react-loadable';
import {Item} from 'canner-helpers';
import Layouts from 'canner-layouts';
import hocs from '../hocs';
import Loading from '../components/Loading';
import type {ComponentTree, ComponentNode} from '../components/types';

export function genCacheTree (tree: ComponentTree): ComponentTree {
  return mapValues(tree, (branch) => {
    return prerender(branch);
  });
}

export function defaultHoc(Component: React$Component<*>) {
  return Component;
}

export function isComponent(node: ComponentNode) {
  return node.nodeType && node.nodeType.startsWith('component');
}

export function isCached(node: ComponentNode) {
  return node.nodeType &&
    node.nodeType === 'component.array.table' &&
    node.cacheActions;
}

export function isLayout(node: ComponentNode) {
  return node.nodeType && node.nodeType.startsWith('layout');
}

export function isFieldset(node: ComponentNode) {
  return node.packageName === '@canner/antd-object-fieldset';
}

export function isPage(node: ComponentNode) {
  return node.nodeType && node.nodeType.startsWith('page');
}

export function isPageRoot (node: ComponentNode) {
  return node.nodeType === 'page.page.default';
}

export function inPage (node: ComponentNode) {
  return node.pattern.startsWith('page');
}

export function createLoadableComponnet(node: ComponentNode) {
  return Loadable({
    loader: () => node.loader || Promise.reject(`There is no loader in ${node.path}`),
    loading: Loading,
  });
}

export function generateComponent(node: any) {
  let {component} = node;
  if (isLayout(node)) {
    if (!node.component) {
      component = Layouts[node.ui];
    }
    return wrapByHOC(component, ['withCannerLayout']);
  }
  
  if (isComponent(node)) {
    if (isFieldset(node)) {
      component = () => <Item />;
    } else {
      component = createLoadableComponnet(node);
    }
    if (isCached(node)) {
      return wrapByHOC(component, ['withCanner', 'withCache', 'errorCatch']);
    }
    return wrapByHOC(component, ['withCanner', 'errorCatch']);
  } else if (isPage(node)) {
    if (isPageRoot(node)) {
      component = () => <Item />;
      return wrapByHOC(component, ['withCannerLayout']);
    } else if (inPage(node)) {
      component = createLoadableComponnet(node);
      return wrapByHOC(component, ['graphqlQuery']);
    } else {
      component = createLoadableComponnet(node);
      component = wrapByHOC(component, ['withCanner', 'errorCatch']);
    }
  }
  return component;
}

export function wrapByHOC(component: any, hocNames: Array<string>): React$Component<*> {
  // find hocs and wrap the component
  while (hocNames.length) {
    const hocName = hocNames.shift();
    const hoc = get(hocs, hocName, defaultHoc);
    component = hoc(component);
  }
  return component;
}

// wrap the plugin with hoc if it has
export function prerender (node: ComponentNode): ComponentNode {
  // add a field `component` in every node.
  // it's a React Component with all hocs it needs in every node
  const copyNode = {...node};
  let component = generateComponent(node);
  if (!component) {
    throw new Error(`invalid node, name: ${copyNode.keyName}, nodeType: ${copyNode.nodeType}`);
  }

  copyNode.component = component;
  if (copyNode.children) {
    copyNode.children = copyNode.children.map((child) => {
      return prerender(child);
    });
  }
  
  return copyNode;
}
