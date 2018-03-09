const path = require('path');

module.exports = {
  entry: {
    index: './docs/index.js',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/docs/static/',
  },
  resolveLoader: {
     moduleExtensions: ["-loader"]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'docs'),
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'node_modules/@canner/image-upload')
        ],
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
      {
        test: /\.scss$/,
        use: [{
            loader: "style-loader" // creates style nodes from JS strings
        }, {
            loader: "css-loader" // translates CSS into CommonJS
        }, {
            loader: "sass-loader" // compiles Sass to CSS
        }]
      },
      {
        test: /\.css$/,
        use: [{
            loader: "style-loader" // creates style nodes from JS strings
        }, {
            loader: "css-loader" // translates CSS into CommonJS
        }]
      },
      {
        test: /\.less$/,
        use: [{
            loader: "style-loader" // creates style nodes from JS strings
        }, {
            loader: "css-loader" // translates CSS into CommonJS
        }, { 
            loader: "less-loader" // translates Less into CSS
        }]
      }
    ],
  },
};
