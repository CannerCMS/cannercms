const types = {
  // "plugins.string": function(path) {
  //   path.node.hocs.unshift("validator");
  //   path.node.validateSchema = {
  //     type: 'string',
  //     ...(path.node.validateSchema || {})
  //   };
  // },
  // "plugins.number": function(path) {
  //   path.node.hocs.unshift("validator");
  //   path.node.validateSchema = {
  //     type: 'number',
  //     ...(path.node.validateSchema || {})
  //   };
  // },
  // "plugins.boolean": function(path) {
  //   path.node.hocs.unshift("validator");
  //   path.node.validateSchema = {
  //     type: 'boolean',
  //     ...(path.node.validateSchema || {})
  //   };
  // },
  // "plugins.array": function(path) {
  //   path.node.hocs.unshift("validator");
  //   path.node.validateSchema = {
  //     type: 'array',
  //     ...(path.node.validateSchema || {})
  //   };
  // },
  'plugins.object': function(path) {
    path.node.hocs.unshift('validator');
    path.node.validateSchema = {
      type: 'object',
      ...(path.node.validateSchema || {}),
    };
  },
};

const arrays = {
  'plugins.array.slider': function(path) {
    path.node.hocs.unshift('validator');
    path.node.validateSchema = {
      type: 'array',
      items: {
        type: 'number',
      },
      ...(path.node.validateSchema || {}),
    };
  },
  'plugins.array.tag': function(path) {
    path.node.hocs.unshift('validator');
    path.node.validateSchema = {
      type: 'array',
      items: {
        type: 'string',
      },
      ...(path.node.validateSchema || {}),
    };
  },
};

export default [types, arrays];
