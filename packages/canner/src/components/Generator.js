// @flow

/**
 * Genertaor is a Component that renders the components, layouts
 * with the a given componentTree which is created by qa-compiler
 *
 * First Step, prerender the tree in constructor, this action will add a
 * React Component with all hocs it needs in every node
 *
 * Second Step, take the node.component to render it, and give the component
 * some props it maybe needs such as renderChildren
 */

import * as React from 'react';
import Loadable from 'react-loadable';
import {Item} from 'canner-helpers';
import get from 'lodash/get';
import isUndefined from 'lodash/isUndefined';
import mapValues from 'lodash/mapValues';
import RefId from 'canner-ref-id';
import Layouts from 'canner-layouts';
import type {GeneratorProps, ComponentTree, ComponentNode} from './types';

function defaultHoc(Component) {
  return Component;
}

function isComponent(node) {
  return node.nodeType && node.nodeType.startsWith('plugins');
}

function isLayout(node) {
  return node.nodeType === 'layout';
}

function isFieldset(node) {
  return node.packageName === '@canner/antd-object-fieldset';
}

function Loading(props: any) {
  if (props.error) {
    return <div>Error! <button onClick={ props.retry }>Retry</button></div>;
  } else {
    return <div>Loading...</div>;
  }
}


type Props = GeneratorProps;

type childrenProps = {
  refId: RefId,
  [string]: any
};

type State = {
  componentTree: {[string]: any},
  error: any,
  errorInfo: Object
}

export default class Generator extends React.PureComponent<Props, State> {
  cacheTree: ComponentTree // store the prerenders tree
  idNodeMap = {}
  constructor(props: Props) {
    // prerender the tree in constructor, this action will add a
    // React Component with all hocs it needs in every node
    super(props);
    const {componentTree, routes, goTo} = props;
    let activeKey = routes[0];
    if (!activeKey) {
      activeKey = Object.keys(componentTree)[0];
      goTo(activeKey);
    }
    this.cacheTree = this.genCacheTree(componentTree);
    this.state = {
      componentTree: this.cacheTree[activeKey],
      error: null,
      errorInfo: {}
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (nextProps.refresh) {
      this.cacheTree = this.genCacheTree(nextProps.componentTree);
    }
    this.setState({
      componentTree: this.cacheTree[nextProps.routes[0] || Object.keys(nextProps.componentTree)[0]],
    });
  }

  componentDidCatch(error: any, errorInfo: Object) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
    // You can also log error messages to an error reporting service here
  }

  genCacheTree = (tree: ComponentTree): ComponentTree => {
    return mapValues(tree, (branch) => {
      return this.prerender(branch);
    });
  }

  static defaultProps = {
    componentTree: {},
    layouts: {},
    hocs: {}
  }

  // wrap the plugin with hoc if it has
  prerender = (node: ComponentNode): ComponentNode => {
    // add a field `component` in every node.
    // it's a React Component with all hocs it needs in every node
    const copyNode = {...node};
    let component;
    if (isLayout(copyNode)) {
      if (typeof copyNode.component === 'string') {
        copyNode.component = Layouts[copyNode.component]
      }
      component = this.wrapByHOC(copyNode.component, (copyNode.hocs || ['containerRouter']).slice() || []);
    } else if (isComponent(copyNode)) { // TODO: need to fix, turn plugins to components in compiler

      if (isFieldset(copyNode)) {
        component = () => <Item />;
      } else {
        component = Loadable({
          loader: () => copyNode.loader || Promise.reject(`There is no loader in ${copyNode.path}`),
          loading: Loading,
        });
      }
      component = this.wrapByHOC(component, ['title', 'onDeploy', 'validation', 'deploy', 'request', 'relation', 'query', 'cache', 'route', 'id', 'context', 'errorCatch'] || []);
    }

    if (!component) {
      throw new Error(`invalid node, name: ${copyNode.keyName}, nodeType: ${copyNode.nodeType}`);
    }

    copyNode.component = component;
    if (copyNode.children) {
      copyNode.children = copyNode.children.map((child) => {
        return this.prerender(child);
      });
    }
    
    return copyNode;
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

  renderNode = (node: ComponentNode, index: number, props: childrenProps): React$Node => {
    // take the node.component to render it, and give the component
    // some props it maybe needs such as renderChildren
    // eslint-disable-next-line no-unused-vars
    if (!node) {
      throw new Error(`Unexpected Error: Want to render a undefined node with refId '${props.refId.toString()}'`);
    }

    const {component, ...restNodeData} = node;
    const {params, goTo, routes, storages, onDeploy, removeOnDeploy, hideButtons, schema} = this.props;
    if (node.hidden || props.hidden) {
      return null;
    }

    if (component) {
      return <node.component
        hideButtons={hideButtons}
        {...restNodeData}
        routes={routes}
        key={index}
        imageServiceConfig={(storages || {})[routes[0]]}
        renderChildren={(props) => this.renderChildren(node, props)}
        renderComponent={this.renderComponent}
        params={params}
        onDeploy={onDeploy}
        removeOnDeploy={removeOnDeploy}
        schema={schema}
        goTo={(path, search) => {
          if (!search) {
            const [route, search] = path.split('?');
            goTo(route, search);
          } else {
            goTo(path, search);
          }
        }}
        {...props}
      />;
    }
    return null;
  }

  static findNode = (pathArr: Array<string>, node: ComponentNode): ?Node => {
    if (isComponent(node) && node.keyName === pathArr[0]) {
      pathArr = pathArr.slice(1);
      if (!pathArr.length) {
        return node;
      }
    }

    if (node.children) {
      return node.children
        .map(child => Generator.findNode(pathArr, child))
        .find(node => !!node);
    }
  }

  renderComponent = (refId: RefId, props: childrenProps): React$Node => {
    const componentPathArr = refId.getPathArr()
      .filter(path => isNaN(Number(path)));
    const componentPath = componentPathArr.join('/');
    let node = this.idNodeMap[componentPath];
    const entryKey = componentPathArr[0];
    if (!node) {
      const lastPath = componentPathArr.slice(1);
      if (lastPath.length === 0) {
        node = this.cacheTree[entryKey];
      } else {
        node = Generator.findNode(componentPathArr.slice(), this.cacheTree[entryKey]);
      }
      this.idNodeMap[componentPath] = node;
    }
    if (!node) {
      throw new Error(`Can't find the node at refId ${refId.toString()}`);
    }
    return this.renderNode(node, 0, {...props});
  }

  renderChildren = (node: ComponentNode, props: childrenProps | Node => childrenProps): React.Node => {
    // just get the props and call renderNode
    // this method is called by components themselves
    const {children} = node;
    if (children) {
      return children.map((child, index) => {
        const childProps = typeof props === 'function' ? props(child) : props;
        const {refId} = childProps;
        if (isUndefined(refId)) {
          throw new Error(`refId is required for renderChildren, please check node '${node.keyName || ''}'`);
        }
        if (childProps.hidden) {
          return null;
        }

        if (childProps.mergeNode) {
          // mutate node
          childProps.mergeNode(node);
        }

        return this.renderNode(child, index, childProps);
      });
    }
    return null;
  }

  render() {
    const {componentTree, error, errorInfo} = this.state;
    const {routes, params} = this.props;
   
    if (error) {
      return errorInfo;
    }
    return (
      <div>
        {/* {this.renderComponent(new RefId(routes.join('/')), {refId: new RefId(routes.slice(1).join('/')), routes, params})} */}
        {this.renderNode(componentTree, 0, {refId: new RefId(''), routes, params})}
      </div>
    );
  }
}
