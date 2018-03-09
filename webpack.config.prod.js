const path = require('path');

module.exports = {
  resolve: {
    alias: {
      'src': path.resolve(__dirname, 'src'),
      'provider': path.resolve(__dirname, 'src/provider'),
      'hocs': path.resolve(__dirname, 'src/hocs'),
      'vistors': path.resolve(__dirname, 'src/vistors'),
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /canner\.schema\.js$/,
        use: [{
          loader: '@canner/canner-schema-loader',
        }, {
          loader: 'babel-loader',
        }],
      },
    ],
  },
};
