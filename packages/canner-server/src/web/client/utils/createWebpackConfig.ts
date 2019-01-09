import * as webpack from 'webpack';
// import for devServer in webpack configration
import * as webpackDevServer from 'webpack-dev-server';
import HtmlWebPackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import {BundleAnalyzerPlugin} from 'webpack-bundle-analyzer';
import path from 'path';
import CompressionPlugin from 'compression-webpack-plugin';
import tmp from 'tmp';
import createEntryFile from './createEntryFile';
import createWindowVarsFile from './createWindowVarsFile';
import {
  tsLoader,
  babelLoader,
} from './webpackCommon';
import {
  HTML_PATH,
  SCHEMA_PATH,
  SCHEMA_OUTPUT_PATH,
  WEB_OUTPUT_PATH,
  CLOUD_PATH,
  RESOLVE_MODULES,
  RESOLVE_LOADER_MODULES
} from '../config';
const devMode = process.env.NODE_ENV !== 'production';

export type CreateSchemaConfigArgsType = {
  schemaPath?: string;
  schemaOutputPath?: string;
  resolveModules?: Array<string>;
  resolveLoaderModules?: Array<string>;
}

export type CreateWebConfigArgsType = {
  webOutputPath?: string;
  htmlPath?: string;
  schemaPath?: string;
  cloudPath?: string;
  resolveModules?: Array<string>;
  resolveLoaderModules?: Array<string>;
}

export type CreateConfigArgsType = {
  schemaOnly?: boolean;
  webOnly?: boolean;
} & CreateSchemaConfigArgsType & CreateWebConfigArgsType

// create temp file
tmp.setGracefulCleanup();

export function createSchemaConfig({
  schemaPath = SCHEMA_PATH,
  schemaOutputPath = SCHEMA_OUTPUT_PATH,
  resolveModules = RESOLVE_MODULES,
  resolveLoaderModules = RESOLVE_LOADER_MODULES,
}: CreateSchemaConfigArgsType): webpack.Configuration {
  return {
    target: 'node',
    entry: schemaPath,
    output: {
      path: schemaOutputPath,
      filename: 'schema.node.js',
      libraryTarget: 'commonjs'
    },
    mode: devMode ? 'development' : 'production',
    resolve: {
      "extensions": [".jsx", ".js", ".ts", ".tsx"],
      modules: resolveModules
    },
    resolveLoader: {
      modules: resolveLoaderModules
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
}

export function createWebConfig({
  webOutputPath = WEB_OUTPUT_PATH,
  htmlPath = HTML_PATH,
  schemaPath = SCHEMA_PATH,
  cloudPath = CLOUD_PATH,
  resolveModules = RESOLVE_MODULES,
  resolveLoaderModules = RESOLVE_LOADER_MODULES,
}: CreateWebConfigArgsType): webpack.Configuration {
  const entryFile = tmp.fileSync({postfix: '.tsx'});
  const windowVarsFile = tmp.fileSync({postfix: '.ts'});
  const ENTRY_PATH = entryFile.name;
  const WINDOW_VARS_PATH = windowVarsFile.name;

  // create entry file dynamic so that we can change appPath, schemaPath by CLI
  createEntryFile({
    entryPath: ENTRY_PATH,
    appPath: path.join(__dirname, '../statics/app')
  });

  createWindowVarsFile({
    windowVarsPath: WINDOW_VARS_PATH,
    schemaPath,
    cloudPath
  });

  return {
    entry: {
      index: [WINDOW_VARS_PATH, ENTRY_PATH]
    },
    output: {
      path: webOutputPath,
      filename: '[name].js',
      chunkFilename: '[name].js',
      publicPath: devMode ? 'http://localhost:8090/' : '/'
    },
    mode: devMode ? 'development' : 'production',
    devServer: {
      port: 8090,
      contentBase: webOutputPath,
      historyApiFallback: true,
      // https://github.com/webpack/webpack-dev-server/issues/1604
      disableHostCheck: true
    },
    resolve: {
      "extensions": [".jsx", ".js", ".ts", ".tsx"],
      modules: resolveModules
    },
    resolveLoader: {
      modules: resolveLoaderModules
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
        template: htmlPath
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
}


export function createConfig({
  schemaOnly = false,
  webOnly = false,
  schemaPath = SCHEMA_PATH,
  schemaOutputPath = SCHEMA_OUTPUT_PATH,
  webOutputPath = WEB_OUTPUT_PATH,
  htmlPath = HTML_PATH,
  cloudPath = CLOUD_PATH,
  resolveModules = RESOLVE_MODULES,
  resolveLoaderModules = RESOLVE_LOADER_MODULES,
}: CreateConfigArgsType): webpack.Configuration[] {
  const config: webpack.Configuration[] = [];
  if (!schemaOnly) {
    const webConfig = createWebConfig({
      webOutputPath,
      htmlPath,
      schemaPath,
      cloudPath,
      resolveLoaderModules,
      resolveModules
    });
    config.push(webConfig);
  }
  
  if (!webOnly) {
    const schemaConfig = createSchemaConfig({
      schemaPath,
      schemaOutputPath,
      resolveLoaderModules,
      resolveModules
    });
    config.push(schemaConfig);
  }

  return config;
}
