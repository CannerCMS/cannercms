const path = require('path');

module.exports = {
  devServer: {
    historyApiFallback: {
      index: '/docs/'
    }
  },
  entry: {
    index: './docs/index.js',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/docs/static/',
  },
  resolve: {
    alias: {
      'styled-components': path.resolve(__dirname, 'node_modules', 'styled-components'),
      react: path.resolve(__dirname, 'node_modules', 'react'),
      'react-dom': path.resolve(__dirname, 'node_modules', 'react-dom'),
      '@canner/react-cms-helpers': path.resolve(__dirname, 'node_modules', '@canner/react-cms-helpers')
    }
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
          options: {
            visitors: path.resolve('lib', 'visitors')
          }
        }, {
          loader: 'babel-loader',
        }],
      },
      {
        test: /\.scss$/,
        use: [{
            loader: "style-loader" // creates style nodes from JS strings
        }, {
            loader: "css-loader", // translates CSS into CommonJS
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
