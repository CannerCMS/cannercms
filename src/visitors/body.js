// @flow

// these vistors handles the body view
// first layer plguin will move into a container (body)
// the routeMap will generate here and given to body container
// so they must be the last vistors to make sure the route will change again!

const arrayBody = {
  'plugins.array': {
    exit: function(path: Path) {
      if (path.node.pattern === 'array') {
        const routeMap = genRouteMap('', path.node);
        const componentInBody = {
          nodeType: 'layout',
          component: 'body',
          children: [{
            nodeType: 'layout',
            component: 'block',
            children: [path.node],
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
  'plugins.object': {
    exit: function(path: Path) {
      if (path.node.pattern === 'object') {
        const routeMap = genRouteMap('', path.node);
        const componentInBody = {
          nodeType: 'layout',
          component: 'body',
          children: [path.node],
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

function genRouteMap(currentRoute: string, node: NodeType): RouteMap {
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
  // merge the routemap of children
  // if ((node.type === 'object' && node.ui === 'fieldset')) {
  //   (node.children || []).forEach(child => {
  //     console.log('here', child);
  //     const childRoute = `${currentRoute}/${child.name}`;
  //     const childMap = genRouteMap(currentRoute, child);
  //     routeMap = {...routeMap, ...childMap};
  //   });
  // } else if (node.type === 'container') {
  //   (node.children || []).forEach(child => {
  //     const childMap = genRouteMap(currentRoute, child);
  //     routeMap = {...routeMap, ...childMap};
  //   });
  // } else {
  //   console.log(node);
  // }

  return routeMap;
}

export default [arrayBody, objectBody];
