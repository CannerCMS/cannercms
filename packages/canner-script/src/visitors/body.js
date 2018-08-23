//@flow
import type {Path, Node} from '../flow-types';
/**
  these vistors handles the body layout that all first level components will move into
 */

const arrayBody = {
  'components.array': {
    exit: function(path: Path) {
      if (path.node.pattern === 'array') {
        const routeMap = genRouteMap('', path.node);
        const componentInBody = {
          nodeType: 'layout',
          component: "body",
          children: [{
            nodeType: 'layout',
            component: "block",
            children: [path.node],
            childrenName: [path.node.name],
          }],
          childrenName: [path.node.name],
          hocs: ['containerRouter'],
          routeMap,
        };
        // remove title description to body container
        path.node.hideTitle = true;
        path.tree.setNode(path.route, componentInBody);
      }
    },
  },
};
const objectBody = {
  'components.object': {
    exit: function(path: Path) {
      if (path.node.pattern === 'object') {
        const routeMap = genRouteMap('', path.node);
        const componentInBody = {
          nodeType: 'layout',
          component: "body",
          children: [path.node],
          childrenName: [path.node.name],
          hocs: ['containerRouter'],
          routeMap,
        };
        // hide first layer title decsription to body container
        path.node.hideTitle = true;
        path.tree.setNode(path.route, componentInBody);
      }
    },
  },
};

type RouteMap = {
  [route: string]: {
    title: string,
    description: string
  }
};

function genRouteMap(currentRoute: string, node: Node): RouteMap {
  let routeMap = {};

  if (node.nodeType.indexOf('layout') === -1) {
    currentRoute = `${currentRoute ? currentRoute + '/' : ''}${node.name || ''}`;
    routeMap[currentRoute] = {
      title: node.title,
      description: node.description,
    };
  }

  // ARRAY_TYPE_PLACEHOLDER may be a index or index
  if (node.type === 'array' && (node.ui === 'tab' || node.ui === 'popup' || node.ui === 'breadcrumb')) {
    currentRoute = `${currentRoute}/[^/]*`;
    routeMap[currentRoute] = {
      title: '編輯',
      description: '',
    };
  }

  (node.children || []).forEach((child) => {
    const childMap = genRouteMap(currentRoute, child);
    routeMap = {...routeMap, ...childMap};
  });

  return routeMap;
}

export default [arrayBody, objectBody];
