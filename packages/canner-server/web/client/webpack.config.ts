import webpack from 'webpack';
import HtmlWebPackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import {BundleAnalyzerPlugin} from 'webpack-bundle-analyzer';
import path from 'path';
import CompressionPlugin from 'compression-webpack-plugin';
import createEntryFile from './src/utils/createEntryFile';
import createWindowVarsFile from './src/utils/createWindowVarsFile';
import {
  tsLoader,
  babelLoader,
  ENTRY_PATH,
  HTML_PATH,
  SCHEMA_PATH,
  WINDOW_VARS_PATH,
  SCHEMA_ONLY,
  WEB_ONLY
} from './webpack.common';
const devMode = process.env.NODE_ENV !== 'production';

// create entry file dynamic so that we can change appPath, schemaPath by CLI
createEntryFile({
  entryPath: ENTRY_PATH,
  appPath: path.join(__dirname, 'src/app')
});

createWindowVarsFile({
  windowVarsPath: WINDOW_VARS_PATH,
  schemaPath: path.join(__dirname, 'schema/canner.schema'),
  cloudPath: path.join(__dirname, 'default.canner.cloud.ts')
});


const schemaConfig: webpack.Configuration = {
  target: 'node',
  entry: SCHEMA_PATH,
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'schema.node.js',
    libraryTarget: 'commonjs'
  },
  mode: devMode ? 'development' : 'production',
  resolve: {
    "extensions": [".jsx", ".js", ".ts", ".tsx"]
  },
  module: {
    rules: [
      tsLoader,
      babelLoader,
      {
        test: /\.(le|c)ss$/,
        loader: 'ignore-loader'
      }
    ]
  },
  plugins: [
    // don't generate other chunks
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    })
  ]
};

const webConfig: webpack.Configuration = {
  entry: {
    index: [WINDOW_VARS_PATH, ENTRY_PATH]
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    chunkFilename: '[name].js',
    publicPath: devMode ? 'http://localhost:8090/' : '/'
  },
  mode: devMode ? 'development' : 'production',
  devServer: {
    port: 8090,
    contentBase: path.join(__dirname, 'dist'),
    historyApiFallback: true,
    // https://github.com/webpack/webpack-dev-server/issues/1604
    disableHostCheck: true
  },
  resolve: {
    "extensions": [".jsx", ".js", ".ts", ".tsx"]
  },
  externals: {
    // antd: "antd",
    react: "React",
    "react-dom": "ReactDOM",
    lodash: "_",
    moment: 'moment',
    firebase: "firebase",
    "styled-components": "styled",
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        style: {
          test: /\.css/,
          name: 'style',
          chunks: 'all',
          enforce: true
        },
        vendors: {
          test: (module) => {
            return module.nameForCondition && /node_modules/.test(module.nameForCondition()) && !(/\.(c|le)ss$/.test(module.type));
          },
          name: 'vendors',
          chunks: 'all',
          priority: -10
        }
      },
    }
  },
  module: {
    rules: [
      tsLoader,
      babelLoader,
      {
        test: /\.css$/,
        use: [devMode ? 'style-loader' : MiniCssExtractPlugin.loader, "css-loader"]
      }, {
        test: /\.less$/,
        use: [
          {
            loader: devMode ? 'style-loader' : MiniCssExtractPlugin.loader
          },
          {
            loader: "css-loader" // translates CSS into CommonJS
          },
          {
            loader: "less-loader", // compiles Less to CSS
            options: {
              javascriptEnabled: true,
              modifyVars: {}
            }
          }
        ]
      }, {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: HTML_PATH
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new MiniCssExtractPlugin({
      filename: 'style.css',
      chunkFilename: 'style.css'
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: devMode ? 'server' : 'disabled',
      openAnalyzer: false
    }),
    new CompressionPlugin()
  ]
};

const config = [];

if (!SCHEMA_ONLY) {
  config.push(webConfig);
}

if (!WEB_ONLY) {
  config.push(schemaConfig);
}

export default config;
