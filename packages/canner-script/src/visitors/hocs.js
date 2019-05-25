/* eslint-disable no-param-reassign */
const visitors = {
  component: {
    enter(path) {
      // first layer
      path.node.hocs = ['withTitleAndDescription']; // the bottom HOC

      path.node.hocs.push('withRequest');
      path.node.hocs.push('relation');

      /**
       *  cache the popup data!
       */
      if (path.node.ui === 'table') {
        path.node.hocs.push('miniApp');
      }

      /**
       *  check whether this plugin need to be rendered,
       *  should be under the query
       *  because it needs the data to render the children of array!
       */
      path.node.hocs.push('withRoute');

      if (path.route.split('.').length === 1 && path.node.ui.startsWith('table')) {
        path.node.hocs.push('query');
      } else {
        path.node.hocs.push('withQuery');
      }

      /**
       *  route mini app must be place at the top of query
       *  because when route changes, it will get query.queryData to fetch the new Data
       */
      path.node.hocs.push('routeMiniApp');

      path.node.hocs.push('connectId'); // the top HOC
    },
  },
  layout: {
    enter(path) {
      path.node.hocs = ['containerRouter', 'context'];
      if (path.node.ui === 'row' || path.node.ui === 'col') {
        path.node.hocs = [];
      }
    },
  },
};

export default [visitors];
