const path = require('path');
const fs = require('fs');

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
}
