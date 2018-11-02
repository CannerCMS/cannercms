const antdTheme = require('./package.json').theme;
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require('path');

const devMode = process.env.NODE_ENV !== 'production'

module.exports = {
  entry: "./docs",
  output: {
    path: path.join(__dirname, 'docs/dist'),
    filename: 'bundle.js',
    publicPath: '/canner/'
  },
  resolve: {
    extensions: [".ts", ".js"],
    alias: {
      'canner-script': path.resolve(__dirname, 'packages', 'canner-script'),
      'canner-helpers': path.resolve(__dirname, 'packages', 'canner-helpers'),
      'styled-components': path.resolve(__dirname, 'node_modules', 'styled-components'),
      react: path.resolve(__dirname, 'node_modules', 'react'),
      'react-dom': path.resolve(__dirname, 'node_modules', 'react-dom'),
      packages: path.resolve(__dirname, "./packages"),
    }
  },
  devServer: {
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: '/canner/index.html' },
      ]
    },
    contentBase: path.join(__dirname, 'docs/dist'),
    publicPath: '/canner/'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: 'tsconfig.release.json'
          }
        }
      },
      {
        test: /(\.schema\.js|canner\.def\.js)$/,
        use: [{
          loader: "canner-schema-loader"
        }, {
          loader: "babel-loader"
        }]
      }, {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }, {
        test: /\.css$/,
        use: [devMode ? 'style-loader' : MiniCssExtractPlugin.loader, "css-loader"]
      }, {
        test: /\.less$/,
        use: [{
          loader: devMode ? 'style-loader' : MiniCssExtractPlugin.loader
        }, {
          loader: 'css-loader'
        }, {
          loader: 'less-loader',
          options: {
            modifyVars: antdTheme,
            javascriptEnabled: true,
          }
        }]
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./docs/index.html",
      filename: "./index.html"
    }),
    new MiniCssExtractPlugin({
      filename: devMode ? '[name].css' : '[name].[hash].css',
      chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
    })
  ]
};