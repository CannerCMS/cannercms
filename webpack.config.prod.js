const path = require('path');
const fs = require('fs');
const antdTheme = require('./package.json').theme;

module.exports = {
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    antd: 'antd',
    lodash: '_',
    firebase: 'firebase',
    immutable: 'Immutable',
    'styled-components': 'styled',
    'canner-slate-editor': 'CannerSlateEditor',
  },
  resolve: {
    alias: {
      packages: path.resolve(__dirname, "./packages"),
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          /**
          * babel-loader doesn't load the .babelrc
          * TODO: Remove once the issue is addressed
          * https://github.com/babel/babel-loader/issues/624
          */
          options: Object.assign(
            {
              babelrc: false,
              cacheDirectory: true
            },
            JSON.parse(fs.readFileSync(path.join(__dirname, '.babelrc'), 'utf-8'))
          ),
        },
      },
      {
        test: /canner\.schema\.js$/,
        use: [{
          loader: 'canner-schema-loader',
        }, {
          loader: 'babel-loader',
          /**
          * babel-loader doesn't load the .babelrc
          * TODO: Remove once the issue is addressed
          * https://github.com/babel/babel-loader/issues/624
          */
          options: Object.assign(
             {
               babelrc: false,
               cacheDirectory: true
             },
             JSON.parse(fs.readFileSync(path.join(__dirname, '.babelrc'), 'utf-8'))
          ),
        }],
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
          loader: "less-loader", // translates Less into CSS
          options: {
            modifyVars: antdTheme,
            javascriptEnabled: true,
          }
        }]
      }
    ],
  },
}
