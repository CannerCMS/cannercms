// @flow

import TreeHandler from './tree';
import VisitorHandler from './visitor';
import type {
  Tree, NodeType, InputVisitor, ParentNode, Route, Path,
} from './types';

export default class Traverser {
  tree: TreeHandler;

  visitor: VisitorHandler;

  constructor(tree: Tree, visitor: InputVisitor) {
    this.tree = new TreeHandler(tree);
    this.visitor = new VisitorHandler(visitor);
  }

  addVisitor(visitor: InputVisitor) {
    this.visitor.merge(visitor);
  }

  traverse() {
    Object.keys(this.tree.getTree()).forEach((key) => {
      this.traverseNode(this.tree.getTree()[key], null, key);
    });
    return this.tree.getTree();
  }

  traverseNode(node: NodeType, parent: ?ParentNode, route: Route) {
    const path: Path = {
      node,
      parent,
      tree: this.tree,
      route,
    };
    this.nodeCallEnter(path);
    if (node.children && node.children.length) {
      this.traverseChildren(node, 0, route);
    }
    this.nodeCallExit(path);
  }

  traverseChildren(parent: ParentNode, childIndex: number, route: Route) {
    if (childIndex >= parent.children.length) {
      return;
    }
    parent.children.forEach((child, i) => {
      if (!parent.children[i]) {
        return;
      }
      this.traverseNode(parent.children[i], parent, `${route}.${i}`);
    });
    // this.traverseNode(parent.children[childIndex], parent, `${route}.${childIndex}`);
    // this.traverseChildren(parent, this.childIndex + 1, route);
  }

  nodeCallEnter(path: Path) {
    const visitor = this.visitor.getVisitor();
    const nodeTypes = path.node.nodeType.split('.');
    let nodeType = '';
    nodeTypes.forEach((type) => {
      if (nodeType === '') {
        nodeType = type;
      } else {
        nodeType += `.${type}`;
      }
      const nodeVisitor = visitor[nodeType];
      if (nodeVisitor && 'enter' in nodeVisitor) {
        nodeVisitor.enter.forEach(method => method(path));
      }
    });
  }

  nodeCallExit(path: Path) {
    const visitor = this.visitor.getVisitor();
    const nodeTypes = path.node.nodeType.split('.');
    let nodeType = '';
    nodeTypes.map((type) => {
      if (nodeType === '') {
        nodeType = type;
      } else {
        nodeType += `.${type}`;
      }
      return nodeType;
    }).reverse()
      .forEach((type) => {
        const nodeVisitor = visitor[type];
        if (nodeVisitor && 'exit' in nodeVisitor) {
          nodeVisitor.exit.forEach(method => method(path));
        }
      });
  }
}
