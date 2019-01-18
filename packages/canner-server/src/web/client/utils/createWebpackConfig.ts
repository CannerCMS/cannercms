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
  createTsLoader,
  babelLoader,
} from './webpackCommon';
import {
  HTML_PATH,
  SCHEMA_PATH,
  SCHEMA_OUTPUT_PATH,
  WEB_OUTPUT_PATH,
  CLOUD_PATH,
  RESOLVE_MODULES,
  RESOLVE_LOADER_MODULES,
  TS_CONFIG_FILE,
  APP_PATH,
  AUTH_PATH,
  GRAPHQL_PORT,
  SCHEMA_OUTPUT_FILENAME
} from '../config';
const devMode = process.env.NODE_ENV === 'development';

export type CreateSchemaConfigArgsType = {
  schemaPath?: string;
  schemaOutputPath?: string;
  resolveModules?: Array<string>;
  resolveLoaderModules?: Array<string>;
  tsConfigFile?: string;
  plugins?: Array<any>;
}

export type CreateWebConfigArgsType = {
  webOutputPath?: string;
  htmlPath?: string;
  schemaPath?: string;
  cloudPath?: string;
  resolveModules?: Array<string>;
  resolveLoaderModules?: Array<string>;
  authPath?: string;
  tsConfigFile?: string;
  appPath?: string;
  graphqlPort?: number;
  plugins?: Array<any>;
}

export type CreateConfigArgsType = {
  schemaOnly?: boolean;
  webOnly?: boolean;
  schemaJsonOutputPath?: string;
  schemaPlugins?: Array<any>;
  webPlugins?: Array<any>;
} & CreateSchemaConfigArgsType & CreateWebConfigArgsType

// create temp file
tmp.setGracefulCleanup();

export function createSchemaConfig({
  schemaPath = SCHEMA_PATH,
  schemaOutputPath = SCHEMA_OUTPUT_PATH,
  resolveModules = RESOLVE_MODULES,
  resolveLoaderModules = RESOLVE_LOADER_MODULES,
  tsConfigFile = TS_CONFIG_FILE,
  plugins = []
}: CreateSchemaConfigArgsType): webpack.Configuration {
  return {
    target: 'node',
    entry: schemaPath,
    output: {
      path: schemaOutputPath,
      filename: SCHEMA_OUTPUT_FILENAME,
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
        createTsLoader({
          configFile: tsConfigFile
        }),
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
      }),
      // mock firebase
      new webpack.NormalModuleReplacementPlugin(
        /firebase/,
        path.resolve(__dirname, 'mock')
      ),
      new BundleAnalyzerPlugin({
        analyzerMode: devMode ? 'static' : 'disabled',
        openAnalyzer: false
      }),
    ].concat(plugins)
  };
}

export function createWebConfig({
  webOutputPath = WEB_OUTPUT_PATH,
  htmlPath = HTML_PATH,
  schemaPath = SCHEMA_PATH,
  cloudPath = CLOUD_PATH,
  resolveModules = RESOLVE_MODULES,
  resolveLoaderModules = RESOLVE_LOADER_MODULES,
  tsConfigFile = TS_CONFIG_FILE,
  appPath = APP_PATH,
  authPath = AUTH_PATH,
  graphqlPort = GRAPHQL_PORT,
  plugins = [],
}: CreateWebConfigArgsType): webpack.Configuration {
  const entryFile = tmp.fileSync({postfix: '.tsx'});
  const windowVarsFile = tmp.fileSync({postfix: '.ts'});
  const ENTRY_PATH = entryFile.name;
  const WINDOW_VARS_PATH = windowVarsFile.name;

  // create entry file dynamic so that we can change appPath, schemaPath by CLI
  createEntryFile({
    entryPath: ENTRY_PATH,
    appPath
  });

  createWindowVarsFile({
    windowVarsPath: WINDOW_VARS_PATH,
    schemaPath,
    cloudPath,
    authPath,
    graphqlPort
  });

  return {
    entry: {
      index: [WINDOW_VARS_PATH, ENTRY_PATH]
    },
    node: {
      dns: 'mock',
      fs: 'empty',
      path: true,
      url: false
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
      antd: "antd",
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
        createTsLoader({
          configFile: tsConfigFile
        }),
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
        inject: true, // will inject the DLL bundles to index.html
        template: htmlPath
      }),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new MiniCssExtractPlugin({
        filename: 'style.css',
        chunkFilename: '[name].css'
      }),
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        openAnalyzer: false
      }),
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1
      }),
      new CompressionPlugin(),
    ].concat(plugins)
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
  tsConfigFile = TS_CONFIG_FILE,
  appPath = APP_PATH,
  graphqlPort = GRAPHQL_PORT,
  schemaPlugins = [],
  webPlugins = []
}: CreateConfigArgsType): webpack.Configuration[] {
  const config: webpack.Configuration[] = [];
  if (!schemaOnly) {
    const webConfig = createWebConfig({
      webOutputPath,
      htmlPath,
      schemaPath,
      cloudPath,
      resolveLoaderModules,
      resolveModules,
      tsConfigFile,
      appPath,
      graphqlPort,
      plugins: webPlugins
    });
    config.push(webConfig);
  }
  
  if (!webOnly) {
    const schemaConfig = createSchemaConfig({
      schemaPath,
      schemaOutputPath,
      resolveLoaderModules,
      resolveModules,
      tsConfigFile,
      plugins: schemaPlugins
    });
    config.push(schemaConfig);
  }

  return config;
}
