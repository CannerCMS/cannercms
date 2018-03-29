// @flow

/**
 * Genertaor is a Component that renders the components, containers
 * with the a given componentTree which is created by qa-compiler
 *
 * First Step, prerender the tree in constructor, this action will add a
 * React Component with all hocs it needs in every node
 *
 * Second Step, take the node.component to render it, and give the component
 * some props it maybe needs such as renderChildren, generateId
 */

import * as React from 'react';
import Loadable from 'react-loadable';
import get from 'lodash/get';
import isUndefined from 'lodash/isUndefined';
import mapValues from 'lodash/mapValues';
import {generateId, createEmptyData, transformData} from '../app/utils';

function defaultHoc(Component) {
  return Component;
}

export type Node = {
  name: string,
  nodeType: string,
  hocs: Array<string>,
  children: Array<Node>,
  component: React.ComponentType<*>,
  loader: Promise<*>
}

type Props = {
  componentTree: {[string]: Node},
  hocs: {[string]: React.ComponentType<*>},
  containers: {[string]: React.ComponentType<*>},
  goTo: (path: string) => void,
  baseUrl: string,
  routes: Array<string>,
  params: {[string]: string},
}

type childrenProps = {
  id: string,
  [string]: any
};

type State = {
  componentTree: {[string]: any}
}

export default class Generator extends React.PureComponent<Props, State> {
  cacheTree: {
    [key: string]: Node
  } // store the prerenders tree
  constructor(props: Props) {
    // prerender the tree in constructor, this action will add a
    // React Component with all hocs it needs in every node
    super(props);
    const {componentTree, routes} = props;
    const activeKey = routes[0] || Object.keys(componentTree)[0];
    this.cacheTree = this.genCacheTree(componentTree);
    this.state = {
      componentTree: this.cacheTree[activeKey],
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.refresh) {
      this.cacheTree = this.genCacheTree(nextProps.componentTree);
    }
    this.setState({
      componentTree: this.cacheTree[nextProps.routes[0] || Object.keys(nextProps.componentTree)[0]],
    });
  }

  genCacheTree = (tree: {[string]: Node}): {[string]: Node} => {
    return mapValues(tree, (branch) => {
      return this.prerender(branch);
    });
  }

  static defaultProps = {
    componentTree: {},
    containers: {},
    hocs: {}
  }

  // wrap the plugin with hoc if it has
  prerender = (node: Node): Node => {
    // add a field `component` in every node.
    // it's a React Component with all hocs it needs in every node
    const {containers} = this.props;
    let component: React.ComponentType<*> = (props) => {
      const {renderChildren, id} = props;
      return <div>
        {renderChildren({id})}
      </div>;
    };
    if (node.nodeType === 'layout') {
      component = get(containers, node.component);
    } else if (node.nodeType.startsWith('plugins')) { // TODO: need to fix, turn plugins to components in compiler
      component = Loadable({
        loader: () => node.loader,
        loading: () => <div>loading</div>,
      });
      component = this.wrapByHOC(component, node.hocs.slice() || []);
    }
    node.component = component;
    if (node.children) {
      node.children = node.children.map((child) => {
        return this.prerender(child);
      });
    }
    return node;
  }

  wrapByHOC = (component: React.ComponentType<*>, hocNames: Array<string>): React.ComponentType<*> => {
    // find hocs and wrap the component
    const {hocs} = this.props;
    while (hocNames.length) {
      const hocName = hocNames.shift();
      const hoc = get(hocs, hocName, defaultHoc);
      component = hoc(component);
    }
    return component;
  }

  renderNode = (node: Node, index: number, props: childrenProps): React$Node => {
    // take the node.component to render it, and give the component
    // some props it maybe needs such as renderChildren, generateId

    // eslint-disable-next-line no-unused-vars
    const {component, children, ...restNodeData} = node;
    const {params, goTo, baseUrl} = this.props;
    if (component) {
      return <node.component
        {...restNodeData}
        generateId={generateId}
        key={index}
        renderChildren={(props) => this.renderChildren(node, props)}
        createEmptyData={createEmptyData}
        transformData={transformData}
        params={params}
        goTo={path => {
          goTo(`${baseUrl}/${path}`)}
        }
        {...props}
      />;
    }
    return null;
  }

  renderChildren = (node: Node, props: childrenProps | Node => childrenProps): React$Node => {
    // just get the props and call renderNode
    // this method is called by components themselves
    const {children} = node;
    if (children) {
      return children.map((child, index) => {
        const childrenProps = typeof props === 'function' ? props(child) : props;
        const {id} = childrenProps;
        if (isUndefined(id)) {
          throw new Error(`id is required for renderChildren, please check '${node.name || ''}'`);
        }
        if (childrenProps.hidden) {
          return null;
        }
        return this.renderNode(child, index, childrenProps);
      });
    }
    return null;
  }

  render() {
    const {componentTree} = this.state;
    const {routes, params} = this.props;
    return (
      <div>
        {this.renderNode(componentTree, 0, {id: '', routes, params})}
      </div>
    );
  }
}
