// @flow

import get from 'lodash/get';
import set from 'lodash/set';
import isArray from 'lodash/isArray';
import unset from 'lodash/unset';
import type {Tree, NodeType, Route} from './types';

export default class TreeHandler {
  tree: Tree;
  constructor(tree: Tree) {
    this.tree = tree;
  }

  getNode(route: Route) {
    // info.children.0.children.1
    route = this.transformRoute(route);
    return get(this.tree, route, {});
  }

  getPath(route: Route) {
    route = this.transformRoute(route);
    return {
      parent: this.getParentNode(route),
      node: this.getNode(route),
    };
  }

  getTree() {
    return this.tree;
  }

  transformRoute(route: Route) {
    route = route.replace(/\.children\./g, '.')
      .replace(/\./g, '.children.');
    return route;
  }

  setNode(route: Route, node: NodeType | Tree) {
    const routes = this.transformRoute(route).split('.');
    set(this.tree, routes, node);
    return this;
  }

  setChildren(route: Route, nodes: NodeType | Array<NodeType>) {
    if (!isArray(nodes)) {
      nodes = ([nodes]: any);
    }
    const routes = this.transformRoute(route).split('.');
    routes.push('children');
    set(this.tree, routes, nodes);
    return this;
  }

  injectChildren(route: Route, opts: {[string]: any}) {
    const routes = this.transformRoute(route).split('.');
    routes.push('children');
    const children = get(this.tree, routes, []);
    children.forEach((child, i) => {
      child = {...child, ...opts};
      set(this.tree, routes.concat(i), child);
    });
    return this;
  }

  injectChildrenFrom(route: Route, opts: {[string]: any}, filter: NodeType => boolean) {
    const routes = this.transformRoute(route).split('.');
    routes.push('children');
    const children = get(this.tree, routes, []);
    children.forEach((child, i) => {
      if (filter(child)) {
        child = {...child, ...opts};
        set(this.tree, routes.concat(i), child);
      }
    });
    return this;
  }

  removeNode(route: Route) {
    const parent = this.getParentNode(route);
    const routes = this.transformRoute(route).split('.');
    if (routes.length < 2) {
      unset(this.tree, routes);
      return this;
    }
    const parentRoute = routes.slice(0, -2).join('.');
    const index = routes[route.length - 1];
    parent.children.splice(index, 1);
    this.setNode(parentRoute, parent);
    return this;
  }

  getParentNode(route: Route) {
    const routes = this.transformRoute(route).split('.');
    if (routes.length < 2) {
      return this.getTree();
    }
    const parentRoute = routes.slice(0, -2).join('.');
    return this.getNode(parentRoute);
  }

  getSiblingNodes(route: Route) {
    let category = 'top';
    const sibling = {
      top: [],
      down: [],
    };
    const rankInChildren = Number(route.slice(route.lastIndexOf('.') + 1));
    const parent = this.getParentNode(route);
    parent.children.forEach((child, i) => {
      if (i === rankInChildren) {
        category = 'down';
      } else {
        sibling[category].push(child);
      }
    });
    return sibling;
  }

  getAncestryNodes(route: Route) {
    return this.getAncestryNodesFrom(route, () => true);
  }

  getAncestryNodesFrom(route: Route, filter: Function) {
    const nodes = [];
    let routes = route.split('.');
    while (routes.length) {
      const parent = this.getParentNode(routes.join('.'));
      if (filter(parent)) {
        nodes.unshift(parent);
      }
      routes.pop();
    }
    return nodes;
  }

  pushChildren(route: Route, newNode: NodeType) {
    const node = this.getNode(route);
    node.children.push(newNode);
    this.setNode(route, node);
    return this;
  }

  unshiftChildren(route: Route, newNode: NodeType) {
    const node = this.getNode(route);
    node.children.unshift(newNode);
    this.setNode(route, node);
    return this;
  }
}
