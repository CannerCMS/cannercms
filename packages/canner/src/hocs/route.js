// @flow
import * as React from 'react';
import {Button, Icon, Spin} from 'antd';
import styled from 'styled-components';
import type {HOCProps} from './types';

const RENDER_CHILDREN = 0;
const RENDER_COMPONENT = 1;
const RENDER_NULL = 2;

const ButtonWrapper = styled.div`
  text-align: right;
`
type State = {
  loading: boolean,
  loadingTip: string
}

export default function withRoute(Com: React.ComponentType<*>) {
  return class ComWithRoute extends React.Component<HOCProps, State> {
    state = {
      loading: false,
      loadingTip: 'loading...'
    };
  
    deploy = () => {
      const {refId, deploy} = this.props;
      this.setState({
        loading: true,
        loadingTip: 'deploying...',
      });
      deploy(refId.getPathArr()[0])
        .then(this.success)
        .catch(this.fail);
    }

    reset = () => {
      const {refId, reset} = this.props;
      this.setState({
        loading: true,
        loadingTip: 'reseting...',
      });
      reset(refId.getPathArr()[0])
        .then(this.success)
        .catch(this.fail);
    }

    success = () => {
      const {goTo, routes} = this.props;
      setTimeout(() => {
        this.setState({
          loading: false
        }, () => {
          goTo(routes[0]);
        });
      }, 400);
    }

    fail = () => {
      this.setState({
        loading: false
      });
    }

    discard = () => {
      const {goTo, routes, params, reset, refId} = this.props;
      if (params.op === 'create') {
        reset(refId.getPathArr()[0]).then(() => goTo(routes.join('/')));
      } else {
        reset(refId.getPathArr()[0]).then(() => goTo(routes.slice(0, -1).join('/')));
      }
      
    }

    render() {
      const {loading, loadingTip} = this.state;
      let {routes, pattern,  path, params, refId, renderChildren, hideButtons, uiParams} = this.props;
      const renderType = getRenderType({
        pattern,
        routes,
        path,
        params
      });
      const pathArrLength = refId.getPathArr().length;
      const routesLength = routes.length;
      const {op} = params;
      let renderKeys = uiParams && uiParams.updateKeys; // render all
      if (op === 'create') {
        renderKeys = uiParams && uiParams.createKeys;
      }
      return <Spin tip={loadingTip} spinning={loading}>
        {
          // quick fix for route array's children
          // need to find a stable way to control route
          (renderType === RENDER_CHILDREN && pattern === 'array' && (routesLength === pathArrLength || (routesLength + 1 === pathArrLength && op === 'create'))) &&
            <Button onClick={this.discard} style={{marginBottom: 16}}>
              <Icon type="arrow-left" /> Back
            </Button>
        }
        {
          renderType === RENDER_CHILDREN && renderChildren(node => {
            return {
              hidden: renderKeys && renderKeys.indexOf(node.keyName) === -1,
              refId
            };
          })
        }
        {
          // quick fix for route array's children
          // need to find a stable way to control route
          (renderType === RENDER_CHILDREN  && pattern === 'array' && !hideButtons && (routesLength === pathArrLength || (routesLength + 1 === pathArrLength && op === 'create'))) &&
            <ButtonWrapper>
              <Button style={{marginRight: 16}} type="primary" onClick={this.deploy}>Confirm</Button>
              <Button onClick={this.reset}>Reset</Button>
            </ButtonWrapper>
        }
        {
          renderType === RENDER_COMPONENT && <Com {...this.props} />
        }
      </Spin>
    }
  }
}

function getRenderType({
  routes,
  path,
  pattern,
  params
}) {
  const paths = genPaths(path, pattern);
  const pathsLength = paths.length;
  const routesLength = routes.length;
  if (routes[0] !== paths[0]) {
    return RENDER_NULL;
  }
  const type = pattern.split('.').slice(-1)[0];
  const {op} = params;
  if (type === 'object') {
    if (routesLength === pathsLength && isCompleteContain(paths, routes)) {
      return RENDER_COMPONENT;
    }
    if (routesLength < pathsLength) {
      return RENDER_COMPONENT;
    }
    if (routesLength > pathsLength) {
      return RENDER_CHILDREN;
    }
    return RENDER_NULL;
  } else if (type === 'array') {
    if (routesLength === pathsLength && isCompleteContain(paths, routes)) {
      return RENDER_CHILDREN;
    }
    if (routesLength < pathsLength) {
      if (routesLength === pathsLength - 1 && op === 'create') {
        return RENDER_CHILDREN;
      }
      return RENDER_COMPONENT;
    }
    if (routesLength > pathsLength) {
      return RENDER_COMPONENT;
    }
    return RENDER_NULL;
  } else {
    if (routesLength === pathsLength && isCompleteContain(paths, routes)) {
      return RENDER_NULL;
    }
    if (routesLength < pathsLength) {
      return RENDER_COMPONENT;
    }
    if (routesLength > pathsLength) {
      return RENDER_COMPONENT;
    }
    return RENDER_NULL;
  }
}

export function isCompleteContain(paths: Array<string>, routes: Array<string>) {
  return paths.map((key, i) => routes[i] === key || key === '__ARRAY_INDEX__')
    .reduce((result: any, curr: any) => result && curr);
}

export function genPaths(path: string, pattern: string): Array<string> {
  const patterns = pattern.split('.');
  const indexs = patterns.map((type, i) => type === 'array' ? i : -1)
    .filter(index => index !== -1);
  let paths = path.split('/')
    .map((route, i) => indexs.indexOf(i) === -1 ? route : [].concat(route, '__ARRAY_INDEX__'))
    .reduce((result: any, curr: any) => result.concat(curr), []);
  return paths;
}
