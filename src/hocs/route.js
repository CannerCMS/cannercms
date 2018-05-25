// @flow
import * as React from 'react';
import {Button, Icon} from 'antd';
import styled from 'styled-components';
import type RefId from 'canner-ref-id';

const RENDER_CHILDREN = 0;
const RENDER_COMPONENT = 1;
const RENDER_NULL = 2;

const ButtonWrapper = styled.div`
  text-align: right;
`

type Props = {
  pattern: string,
  routes: Array<string>,
  path: string,
  params: {
    op: string
  },
  goTo: Function,
  refId: RefId,
  deploy: Function,
  reset: Function,
  hideButtons: boolean,
  renderChildren: (Object) => React.Node,
  request: Function,
  keyName: string,
  items: Object
}

export default function withRoute(Com: React.ComponentType<*>) {
  return class ComWithRoute extends React.Component<Props> {
    deploy = () => {
      const {refId, deploy, goTo, routes} = this.props;
      deploy(refId.getPathArr()[0])
        .then(() => goTo(routes[0]));
    }

    reset = () => {
      const {refId, reset, goTo, routes} = this.props;
      reset(refId.getPathArr()[0])
        .then(() => goTo(routes[0]));
    }

    back = () => {
      const {goTo, routes, params} = this.props;
      if (params.op === 'create') {
        goTo(routes.join('/'));
      } else {
        goTo(routes.slice(0, -1).join('/'));
      }
    }

    render() {
      let {routes, pattern,  path, params, refId, renderChildren, hideButtons} = this.props;
      const renderType = getRenderType({
        pattern,
        routes,
        path,
        params
      });
      const pathArrLength = refId.getPathArr().length;
      const routesLength = routes.length;
      const {op} = params;
      return <React.Fragment>
        {
          // quick fix for route array's children
          // need to find a stable way to control route
          (renderType === RENDER_CHILDREN && (routesLength > pathArrLength || routesLength === pathArrLength && op === 'create')) &&
            <Button onClick={this.back} style={{marginBottom: 16}}>
              <Icon type="arrow-left" /> Back
            </Button>
        }
        {
          renderType === RENDER_CHILDREN && renderChildren({
            refId
          })
        }
        {
          // quick fix for route array's children
          // need to find a stable way to control route
          (renderType === RENDER_CHILDREN && !hideButtons && (routesLength > pathArrLength || routesLength === pathArrLength && op === 'create')) &&
            <ButtonWrapper>
              <Button style={{marginRight: 16}} type="primary" onClick={this.deploy}>Confirm</Button>
              <Button onClick={this.reset}>Reset</Button>
            </ButtonWrapper>
        }
        {
          renderType === RENDER_COMPONENT && <Com {...this.props} />
        }
      </React.Fragment>
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
      if (op === 'create') {
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
    .reduce((result, curr) => result && curr);
}

export function genPaths(path: string, pattern: string) {
  const patterns = pattern.split('.');
  const indexs = patterns.map((type, i) => type === 'array' ? i : -1)
    .filter(index => index !== -1);
  let paths = path.split('/')
    .map((route, i) => indexs.indexOf(i) === -1 ? route : [].concat(route, '__ARRAY_INDEX__'))
    .reduce((result, curr) => result.concat(curr), []);
  return paths;
}
