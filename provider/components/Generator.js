// @flow

/**
 * Genertaor is a Component that renders the plugins, containers
 * with the a given componentTree which is created by qa-compiler
 *
 * First Step, prerender the tree in constructor, this action will add a
 * React Component with all hocs it needs in every node
 *
 * Second Step, take the node.component to render it, and give the component
 * some props it maybe needs such as renderChildren, generateId
 */

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import isUndefined from 'lodash/isUndefined';
import isFunction from 'lodash/isFunction';
import mapValues from 'lodash/mapValues';
import hocs from './hocs';
import containers from './containers';
import {generateId, createEmptyData, transformData} from './utils';
import type {RouterHistory} from 'react-router';

function defaultHoc(Component) {
  return Component;
}

type Props = {
  componentTree: {[string]: any},
  plugins: {[string]: React$Component<*>},
  hocs: {[string]: React$Component<*>},
  containers: {[string]: any},
  onChange: (id: string, type: 'create' | 'update' | 'delete' | 'swap', value?: any) => void,
  onChangeMulti: Array<{id: string, type: 'create' | 'update' | 'delete' | 'swap', value?: any}> => void,
  activeKey: string,
  route: string,
  history: RouterHistory,
  refresh: boolean
}

type childrenProps = {[string]: any};

type State = {
  componentTree: {[string]: any},
  hideId: Array<string>
}

export default class QAGenerator extends PureComponent<Props, State> {
  cacheTree: {
    [key: string]: NodeType
  } // store the prerenders tree
  constructor(props: Props) {
    // prerender the tree in constructor, this action will add a
    // React Component with all hocs it needs in every node
    super(props);
    const {componentTree, activeKey} = props;
    this.cacheTree = this.genCacheTree(componentTree);
    this.state = {
      hideId: [],
      componentTree: this.cacheTree[activeKey]
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.refresh) {
      this.cacheTree = this.genCacheTree(nextProps.componentTree);
    }
    this.setState({
      componentTree: this.cacheTree[nextProps.activeKey]
    });
  }

  genCacheTree = (tree: {[string]: any}) => {
    return mapValues(tree, branch => {
      return this.prerender(branch);
    });
  }

  static defaultProps = {
    componentTree: {},
    plugins: {},
    hocs,
    containers,
    history
  }

  static childContextTypes = {
    hideId: PropTypes.arrayOf(PropTypes.string)
  }

  getChildContext() {
    return {
      hideId: this.state.hideId
    };
  }

  // wrap the plugin with hoc if it has
  prerender = (node: NodeType) => {
    // add a field `component` in every node.
    // it's a React Component with all hocs it needs in every node
    const {plugins, containers} = this.props;
    let component = props => {
      const {renderChildren, id} = props;
      return <div>
        {renderChildren({value: props.value, id})}
      </div>;
    };
    if (node.nodeType.startsWith('container')) {
      const uselessStringLength = "container.".length;
      component = get(containers, node.nodeType.slice(uselessStringLength), component);
    } else if (node.nodeType.startsWith('plugins')) {
      const uselessStringLength = "plugins.".length;
      // eslint-disable-next-line
      component = get(plugins, node.nodeType.slice(uselessStringLength), component);
      component = this.wrapByHOC(component, node.hocs.slice() || []);
    }
    node.component = component;
    if (node.children) {
      node.children = node.children.map(child => {
        return this.prerender(child);
      });
    }
    return node;
  }

  wrapByHOC = (component: React$Component<*>, hocNames: Array<string>) => {
    // find hocs and wrap the component
    const {hocs} = this.props;
    while (hocNames.length) {
      const hocName = hocNames.shift();
      const hoc = get(hocs, hocName, defaultHoc);
      component = hoc(component);
    }
    return component;
  }

  renderNode = (node: NodeType, index: number, props: childrenProps = {}): React$Node => {
    // take the node.component to render it, and give the component
    // some props it maybe needs such as renderChildren, generateId

    // eslint-disable-next-line no-unused-vars
    const {component, children, ...restNodeData} = node;
    const {history} = this.props;
    if (component) {
      return <node.component
        {...restNodeData}
        generateId={generateId}
        key={index}
        renderChildren={props => this.renderChildren(node, props)}
        createEmptyData={createEmptyData}
        transformData={transformData}
        history={history}
        {...props}
      />;
    }
    return null;
  }

  renderChildren = (node: NodeType, props: childrenProps | React$Node => childrenProps) => {
    // just get the props and call renderNode
    // this method is called by plugins themselves
    const {children} = node;
    if (children) {
      return children.map((child, index) => {
        // $FlowFixMe
        const childrenProps = isFunction(props) ? props(child) : props;
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
    return (
      <div>
        {this.renderNode(componentTree, 0, {id: ''})}
      </div>
    );
  }
}