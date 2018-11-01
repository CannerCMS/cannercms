const path = require('path');
const webpack = require('webpack');

module.exports = {
  devServer: {
    historyApiFallback: {
      index: '/docs/'
    }
  },
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  entry: {
    index: './docs/index.js',
  },
  externals: {
    'react': "React",
    'react-dom': "ReactDOM",
    'antd': 'antd',
    'lodash': '_',
    'firebase': 'firebase',
    'styled-components': 'styled',
    'canner-slate-editor': 'CannerSlateEditor'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/docs/static/',
  },
  resolve: {
    extensions: [".ts", ".js"],
    alias: {
      // aliasing canner-script and canner-helpers is for symlink when developing
      'canner-script': path.resolve(__dirname, 'packages', 'canner-script'),
      'canner-helpers': path.resolve(__dirname, 'packages', 'canner-helpers'),
      'styled-components': path.resolve(__dirname, 'node_modules', 'styled-components'),
      react: path.resolve(__dirname, 'node_modules', 'react'),
      'react-dom': path.resolve(__dirname, 'node_modules', 'react-dom'),
      packages: path.resolve(__dirname, "./packages"),
    }
  },
  resolveLoader: {
    moduleExtensions: ["-loader"]
  },
  plugins: [
    new webpack.DefinePlugin({
      FIREBASE_API_KEY: JSON.stringify(process.env.FIREBASE_API_KEY),
    }),
    // https://github.com/graphql/graphql-language-service/issues/128
    new webpack.ContextReplacementPlugin(
      /graphql-language-service-interface[\\/]dist$/,
      new RegExp(`^\\./.*\\.js$`)
    )
  ],
  module: {
    rules: [
      {
        type: 'javascript/auto',
        test: /\.mjs$/,
        use: []
      },
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
          loader: './packages/canner-schema-loader/lib/index.js',
        }, {
          loader: 'babel-loader'
        }],
      },
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'docs'),
          path.resolve(__dirname, 'packages'),
          path.resolve(__dirname, 'node_modules/@canner/image-upload')
        ],
        use: {
          loader: 'babel-loader',
        },
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
          loader: 'style-loader'
        }, {
          loader: 'css-loader'
        }, {
          loader: 'less-loader',
          options: {
            modifyVars: {
              "menu-dark-bg": "#373d62",
              "layout-sider-background": "#373d62",
              "layout-header-background": "#373d62",
              "layout-trigger-background": "#373d62",
              "primary-color": "#f2b173",
              "btn-primary-bg": "#6bbcbc",
              "progress-default-color": "#6bbcbc",
              "menu-dark-item-selected-bg": "#283050",
              "menu-dark-item-active-bg": "#283050",
              "item-active-bg": "rgba(242, 177, 115, 0.1)",
              "item-hover-bg": "rgba(242, 177, 115, 0.3)",
              "font-size-base": "14px"
            },
            javascriptEnabled: true,
          }
        }]
      }
    ],
  },
};
