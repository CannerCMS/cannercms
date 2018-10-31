//@flow
import type {Path} from '../flow-types';
import {genRouteMap} from '../utils';

/**
  these vistors handles the body layout that all first level components will move into
 */

const arrayBody = {
  'component.array': {
    exit: function(path: Path) {
      if (path.node.inBody) {
        // already has body layout
        return;
      }
      if (path.node.pattern === 'array') {
        const routeMap = genRouteMap('', path.node);
        const componentInBody = {
          nodeType: 'layout.body',
          ui: "body",
          children: [{
            nodeType: 'layout.block',
            ui: "block",
            children: [path.node],
          }],
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
  'component.object': {
    exit: function(path: Path) {
      if (path.node.inBody) {
        // already has body layout
        return;
      }
      if (path.node.pattern === 'object') {
        const routeMap = genRouteMap('', path.node);
        const componentInBody = {
          nodeType: 'layout.body',
          ui: 'body',
          children: [{
            nodeType: 'layout.block',
            ui: "block",
            children: [path.node],
          }],
          routeMap,
        };
        // hide first layer title decsription to body container
        path.node.hideTitle = true;
        path.tree.setNode(path.route, componentInBody);
      }
    },
  },
};
const pageBody = {
  'page.page': {
    exit: function(path: Path) {
      if (path.node.inBody) {
        // already has body layout
        return;
      }
      const routeMap = genRouteMap('', path.node);
      const componentInBody = {
        nodeType: 'layout.body',
        ui: "body",
        children: [path.node],
        routeMap,
      };
      // remove title description to body container
      path.node.hideTitle = true;
      path.tree.setNode(path.route, componentInBody);
    },
  },
};

export default [arrayBody, objectBody, pageBody];
