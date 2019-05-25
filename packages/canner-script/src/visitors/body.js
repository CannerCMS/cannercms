// @flow
/* eslint-disable no-param-reassign */
import type { Path } from '../flow-types';

/**
  these vistors handles the body layout that all first level components will move into
 */

const arrayBody = {
  'component.array': {
    exit(path: Path) {
      if (path.node.inBody) {
        // already has body layout
        return;
      }
      if (path.node.pattern === 'array') {
        const componentInBody = {
          nodeType: 'layout.body',
          ui: 'body',
          children: [{
            nodeType: 'layout.block',
            ui: 'block',
            children: [path.node],
          }],
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
    exit(path: Path) {
      if (path.node.inBody) {
        // already has body layout
        return;
      }
      if (path.node.pattern === 'object') {
        const componentInBody = {
          nodeType: 'layout.body',
          ui: 'body',
          children: [{
            nodeType: 'layout.block',
            ui: 'block',
            children: [path.node],
          }],
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
    exit(path: Path) {
      if (path.node.inBody) {
        // already has body layout
        return;
      }
      const componentInBody = {
        nodeType: 'layout.body',
        ui: 'body',
        children: [path.node],
      };
      // remove title description to body container
      path.node.hideTitle = true;
      path.tree.setNode(path.route, componentInBody);
    },
  },
};

export default [arrayBody, objectBody, pageBody];
