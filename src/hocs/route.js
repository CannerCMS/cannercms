// @flow
import * as React from 'react';
import type RefId from 'canner-ref-id';

const RENDER_CHILDREN = 0;
const RENDER_COMPONENT = 1;
const RENDER_NULL = 2;

type Props = {
  pattern: string,
  routes: Array<string>,
  path: string,
  params: {
    op: string
  },
  refId: RefId,
  renderChildren: (Object) => React.Node
}

export default function withRoute(Com: React.ComponentType<*>) {
  return class ComWithRoute extends React.Component<Props> {
    render() {
      const {routes, pattern,  path, params, refId, renderChildren} = this.props;
      const renderType = getRenderType({
        pattern,
        routes,
        path,
        params
      });
      return <React.Fragment>
        {
          renderType === RENDER_CHILDREN && renderChildren({
            refId
          })
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
  pattern
}) {
  const paths = genPaths(path, pattern);
  const pathsLength = paths.length;
  const routesLength = routes.length;
  if (routes[0] !== paths[0]) {
    return RENDER_NULL;
  }
  const type = pattern.split('.').slice(-1)[0];
  
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