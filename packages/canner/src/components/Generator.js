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
import {
  get,
  isUndefined,
  mapValues,
  isEqual
} from 'lodash';
import RefId from 'canner-ref-id';
import Layouts from 'canner-layouts';
import {Alert} from 'antd';
import {Item, Context} from 'canner-helpers';
import hocs from '../hocs';
import {List} from 'react-content-loader';
import type {GeneratorProps, ComponentTree, ComponentNode} from './types';

type Props = GeneratorProps;

type childrenProps = {
  refId: RefId,
  [string]: any
};

type State = {
  cacheTree: {[string]: any},
  error: any,
  errorInfo: Object
}

export default class Generator extends React.Component<Props, State> {
  idNodeMap = {}

  static defaultProps = {
    componentTree: {},
    layouts: {}
  }

  constructor(props: Props) {
    super(props);
    const {componentTree} = props;
    this.state = {
      cacheTree: genCacheTree(componentTree),
      error: null,
      errorInfo: {}
    };
  }

  componentDidMount() {
    const {componentTree, routes, goTo, defaultKey} = this.props;
    let activeKey = routes[0];
    if (!activeKey) {
      activeKey = Object.keys(componentTree)[0];
      goTo({pathname: defaultKey || activeKey});
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.refresh && !isEqual(prevProps.componentTree, this.props.componentTree)) {
      this.setState({
        cacheTree: genCacheTree(this.props.componentTree)
      });
    }

    if (isToList(prevProps, this.props)) {
      this.props.reset && this.props.reset();
    }
  }

  componentDidCatch(error: any, errorInfo: Object) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
  }

  renderNode = (node: ComponentNode, props: childrenProps, index: number): React$Node => {
    // take the node.component to render it, and give the component
    // some props it maybe needs such as renderChildren
    // eslint-disable-next-line no-unused-vars
    if (!node) {
      throw new Error(`Unexpected Error: Want to render a undefined node with refId '${props.refId.toString()}'`);
    }

    const {component, ...restNodeData} = node;
    const {routerParams = {}, goTo, routes, imageStorages, fileStorages, onDeploy, removeOnDeploy, hideButtons, schema} = this.props;
    const renderChildren = props => this.renderChildren(node, props);

    if (node.hidden || props.hidden) {
      return null;
    }

    if (component) {
      const contextValue = {
        renderChildren,
        routes,
        refId: props.refId
      };
      return (
        <Context.Provider
          key={restNodeData.keyName ? `${props.refId.toString()}/${restNodeData.keyName}` : index}
          value={contextValue}
        >
          <node.component
            hideButtons={hideButtons}
            routes={routes}
            imageStorage={(imageStorages || {})[routes[0]]}
            fileStorage={(fileStorages || {})[routes[0]]}
            renderChildren={(props) => this.renderChildren(node, props)}
            renderComponent={this.renderComponent}
            routerParams={routerParams}
            onDeploy={onDeploy}
            removeOnDeploy={removeOnDeploy}
            schema={schema}
            goTo={goTo}
            {...restNodeData}
            {...props}
          />
        </Context.Provider>
      );
    }
    return null;
  }

  renderComponent = (refId: RefId, props: childrenProps): React$Node => {
    const {cacheTree} = this.state;
    const componentPathArr = refId.getPathArr()
      .filter(path => isNaN(Number(path)));
    const componentPath = componentPathArr.join('/');
    let node = this.idNodeMap[componentPath];
    const entryKey = componentPathArr[0];
    if (!node) {
      const lastPath = componentPathArr.slice(1);
      if (lastPath.length === 0) {
        node = cacheTree[entryKey];
      } else {
        node = findNode(componentPathArr.slice(), cacheTree[entryKey]);
      }
      this.idNodeMap[componentPath] = node;
    }
    if (!node) {
      throw new Error(`Can't find the node at refId ${refId.toString()}`);
    }
    return this.renderNode(node, {refId: refId.remove(1), keyName: refId.getPathArr().slice(-1)[0], ...props}, 0);
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

        return this.renderNode(child, childProps, index);
      });
    }
    return null;
  }

  render() {
    const {cacheTree, error, errorInfo} = this.state;
    const {routes, routerParams} = this.props;
    if (error) {
      return errorInfo;
    }

    if (!routes[0] || !cacheTree[routes[0]]) {
      return null;
    }

    return (
      <div>
        {this.renderNode(cacheTree[routes[0]], {refId: new RefId(''), routes, routerParams}, 0)}
      </div>
    );
  }
}


function defaultHoc(Component) {
  return Component;
}

function isComponent(node) {
  return node.nodeType && node.nodeType.startsWith('component');
}

function isLayout(node) {
  return node.nodeType && node.nodeType.startsWith('layout');
}

function isFieldset(node) {
  return node.packageName === '@canner/antd-object-fieldset';
}

function isPage(node) {
  return node.nodeType && node.nodeType.startsWith('page');
}

function isPageRoot (node) {
  return node.nodeType === 'page.page.default';
}

function inPage (node) {
  return node.pattern.startsWith('page');
}

function Loading(props: any) {
  if (props.error) {
    return <Alert
      message="Something went wrong."
      description={props.error}
      type="error"
      closable
    />
  } else {
    return <List style={{maxWidth: '600px'}}/>;
  }
}

function createLoadableComponnet(node) {
  return Loadable({
    loader: () => node.loader || Promise.reject(`There is no loader in ${node.path}`),
    loading: Loading,
  });
}

function generateComponent(node) {
  let {component} = node;
  if (isLayout(node)) {
    if (!node.component) {
      component = Layouts[node.ui];
    }
    return wrapByHOC(component, node.ui === 'condition' ? ['containerQuery', 'context'] : ['context']);
  }
  
  if (isComponent(node)) {
    if (isFieldset(node)) {
      component = () => <Item />;
    } else {
      component = createLoadableComponnet(node);
    }
    return wrapByHOC(component, ['title', 'onDeploy', 'validation', 'deploy', 'request', 'relation', 'query', 'cache', 'route', 'id', 'context', 'errorCatch']);
  } else if (isPage(node)) {
    if (isPageRoot(node)) {
      component = () => <Item />;
    } else if (inPage(node)) {
      component = createLoadableComponnet(node);
      return wrapByHOC(component, ['graphqlQuery']);
    } else {
      component = createLoadableComponnet(node);
      component = wrapByHOC(component, ['title', 'onDeploy', 'validation', 'deploy', 'request', 'relation', 'query', 'cache', 'route', 'id', 'context', 'errorCatch']);
    }
  }
  return component;
}

function wrapByHOC(component: React.ComponentType<*>, hocNames: Array<string>): React.ComponentType<*> {
  // find hocs and wrap the component
  while (hocNames.length) {
    const hocName = hocNames.shift();
    const hoc = get(hocs, hocName, defaultHoc);
    component = hoc(component);
  }
  return component;
}

// wrap the plugin with hoc if it has
function prerender (node: ComponentNode): ComponentNode {
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

function genCacheTree (tree: ComponentTree): ComponentTree {
  return mapValues(tree, (branch) => {
    return prerender(branch);
  });
}


export function findNode (pathArr: Array<string>, node: ComponentNode): ?Node {
  if (isComponent(node) && node.keyName === pathArr[0]) {
    pathArr = pathArr.slice(1);
    if (!pathArr.length) {
      return node;
    }
  }

  if (node.children) {
    return node.children
      .map(child => findNode(pathArr, child))
      .find(node => !!node);
  }
}

export function isToList(preProps: Props, props: Props) {
  const preRoutes = JSON.stringify(preProps.routes);
  const routes = JSON.stringify(props.routes);
  const preOperator = preProps.routerParams.operator;
  const operator = props.routerParams.operator;
  return preRoutes === routes && (preOperator === 'create' && operator === 'update');
}
