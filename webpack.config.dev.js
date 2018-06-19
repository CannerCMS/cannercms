const path = require('path');
const webpack = require('webpack');

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
      'canner-graphql-interface': path.resolve(__dirname, 'node_modules/canner-graphql-interface'),
      'styled-components': path.resolve(__dirname, 'node_modules', 'styled-components'),
      react: path.resolve(__dirname, 'node_modules', 'react'),
      'react-dom': path.resolve(__dirname, 'node_modules', 'react-dom'),
      'cms-helpers': path.resolve(__dirname, 'node_modules', 'cms-helpers'),
      '@canner': path.resolve(__dirname, 'node_modules', '@canner'),
      'antd': path.resolve(__dirname, 'node_modules/antd')
    }
  },
  resolveLoader: {
     moduleExtensions: ["-loader"]
  },
  plugins: [
    new webpack.DefinePlugin({
      FIREBASE_API_KEY: JSON.stringify(process.env.FIREBASE_API_KEY),
    })
  ],
  module: {
    rules: [
      {
        test: /(\.schema\.js|canner\.def\.js)$/,
        use: [{
          loader: 'canner-schema-loader',
        }, {
          loader: 'babel-loader',
        }],
      },
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
