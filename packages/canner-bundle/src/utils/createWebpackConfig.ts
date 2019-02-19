import * as webpack from 'webpack';
// import for devServer in webpack configration
import * as webpackDevServer from 'webpack-dev-server';
import HtmlWebPackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import {BundleAnalyzerPlugin} from 'webpack-bundle-analyzer';
import TimeFixPlugin from 'time-fix-plugin';
import path from 'path';
import CompressionPlugin from 'compression-webpack-plugin';
import tmp from 'tmp';
import SpeedMeasurePlugin from 'speed-measure-webpack-plugin';
import createEntryFile from './createEntryFile';
import createWindowVarsFile from './createWindowVarsFile';
import {
  createTsLoader,
  babelLoader,
  CustomFilterPlugin
} from './webpackCommon';
import {
  HTML_PATH,
  SCHEMA_PATH,
  SCHEMA_OUTPUT_PATH,
  WEB_OUTPUT_PATH,
  CMS_CONFIG,
  RESOLVE_MODULES,
  RESOLVE_LOADER_MODULES,
  TS_CONFIG_FILE,
  APP_PATH,
  AUTH_PATH,
  SCHEMA_OUTPUT_FILENAME
} from '../config';
const devMode = process.env.NODE_ENV === 'development';
const smp = new SpeedMeasurePlugin({
  disable: !process.env.MEASURE
});

export type CreateSchemaConfigArgsType = {
  schemaPath?: string;
  schemaOutputPath?: string;
  resolveModules?: Array<string>;
  resolveLoaderModules?: Array<string>;
  tsConfigFile?: string;
  plugins?: Array<any>;
  watch?: any;
  devMode?: boolean;
}

export type CreateWebConfigArgsType = {
  webOutputPath?: string;
  htmlPath?: string;
  schemaPath?: string;
  cmsConfig?: Record<string, any>;
  resolveModules?: Array<string>;
  resolveLoaderModules?: Array<string>;
  authPath?: string;
  tsConfigFile?: string;
  appPath?: string;
  plugins?: Array<any>;
  baseUrl?: string;
  i18nMessages?: Object;
  watch?: any;
  devServerPort?: number;
  devMode?: boolean;
}

export type CreateConfigArgsType = {
  schemaOnly?: boolean;
  webOnly?: boolean;
  schemaJsonOutputPath?: string;
  schemaPlugins?: Array<any>;
  webPlugins?: Array<any>;
  watch?: any;
} & CreateSchemaConfigArgsType & CreateWebConfigArgsType

// create temp file
tmp.setGracefulCleanup();

export function createSchemaConfig({
  schemaPath = SCHEMA_PATH,
  schemaOutputPath = SCHEMA_OUTPUT_PATH,
  resolveModules = RESOLVE_MODULES,
  resolveLoaderModules = RESOLVE_LOADER_MODULES,
  tsConfigFile = TS_CONFIG_FILE,
  plugins = [],
  watch = false,
  devMode = false,
}: CreateSchemaConfigArgsType): webpack.Configuration {
  return {
    target: 'node',
    entry: schemaPath,
    output: {
      path: schemaOutputPath,
      filename: SCHEMA_OUTPUT_FILENAME,
      libraryTarget: 'commonjs'
    },
    watch,
    mode: devMode ? 'development' : 'production',
    resolve: {
      // mjs to fix https://github.com/graphql/graphql-js/issues/1272
      "extensions": [".jsx", ".js", ".ts", ".tsx", "mjs"],
      modules: resolveModules
    },
    resolveLoader: {
      modules: resolveLoaderModules
    },
    module: {
      rules: [
        // mjs to fix https://github.com/graphql/graphql-js/issues/1272
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto'
        },
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
    ].concat(plugins)
  };
}

export function createWebConfig({
  webOutputPath = WEB_OUTPUT_PATH,
  htmlPath = HTML_PATH,
  schemaPath = SCHEMA_PATH,
  cmsConfig = CMS_CONFIG,
  resolveModules = RESOLVE_MODULES,
  resolveLoaderModules = RESOLVE_LOADER_MODULES,
  tsConfigFile = TS_CONFIG_FILE,
  appPath = APP_PATH,
  authPath = AUTH_PATH,
  baseUrl = '/cms',
  i18nMessages = {},
  plugins = [],
  watch = false,
  devServerPort = 8090,
  devMode = false
}: CreateWebConfigArgsType): webpack.Configuration {
  const entryFile = tmp.fileSync({postfix: '.tsx'});
  const windowVarsFile = tmp.fileSync({postfix: '.ts'});
  const ENTRY_PATH = entryFile.name;
  const WINDOW_VARS_PATH = windowVarsFile.name;

  // create entry file dynamic so that we can change appPath, schemaPath by CLI
  createEntryFile({
    entryPath: ENTRY_PATH,
    appPath,
    baseUrl,
    i18nMessages
  });

  createWindowVarsFile({
    windowVarsPath: WINDOW_VARS_PATH,
    schemaPath,
    cmsConfig,
    authPath
  });
  if (watch) {
    plugins.push(new webpack.HotModuleReplacementPlugin());
  }
  return smp.wrap({
    entry: {
      index: [WINDOW_VARS_PATH, ENTRY_PATH]
    },
    node: {
      dns: 'mock',
      fs: 'empty',
      path: true,
      url: false
    },
    performance: {
      hints: false
    },
    watch,
    watchOptions: {
      aggregateTimeout: 2000,
      ignored: ['.cms', webOutputPath, 'schema.node.js', 'canner.schema.json', 'node_modules']
    },
    output: {
      path: webOutputPath,
      filename: '[name].js',
      chunkFilename: '[name].js',
      publicPath: '/'
    },
    mode: devMode ? 'development' : 'production',
    devServer: {
      port: devServerPort,
      contentBase: webOutputPath,
      historyApiFallback: true,
      // https://github.com/webpack/webpack-dev-server/issues/1604
      disableHostCheck: true,
      quiet: true,
      hot: true,
      inline: true
    },
    resolve: {
      // mjs to fix https://github.com/graphql/graphql-js/issues/1272
      "extensions": [".jsx", ".js", ".ts", ".tsx", ".mjs"],
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
            enforce: true
          }
        },
      }
    },
    module: {
      rules: [
        // mjs to fix https://github.com/graphql/graphql-js/issues/1272
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto'
        },
        createTsLoader({
          configFile: tsConfigFile
        }),
        babelLoader,
        {
          test: /\.css$/,
          use: [
            devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
            "css-loader"
          ]
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
                modifyVars: (cmsConfig.style && cmsConfig.style.theme) || {}
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
      new MiniCssExtractPlugin({
        filename: 'style.css',
        chunkFilename: '[name].css'
      }),
      // temp solution for firebase undefined, since we will remove the canner-graphql-interface in the future
      new webpack.NormalModuleReplacementPlugin(
        /firebase/,
        path.resolve(__dirname, 'mock')
      ),
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1
      }),
      new CompressionPlugin(),
      new CustomFilterPlugin({
        exclude: /Conflicting order between:/
      }),
      new TimeFixPlugin()
    ].concat(plugins)
  });
}


export function createConfig({
  schemaOnly = false,
  webOnly = false,
  schemaPath = SCHEMA_PATH,
  schemaOutputPath = SCHEMA_OUTPUT_PATH,
  webOutputPath = WEB_OUTPUT_PATH,
  htmlPath = HTML_PATH,
  cmsConfig = CMS_CONFIG,
  resolveModules = RESOLVE_MODULES,
  resolveLoaderModules = RESOLVE_LOADER_MODULES,
  tsConfigFile = TS_CONFIG_FILE,
  appPath = APP_PATH,
  authPath = AUTH_PATH,
  schemaPlugins = [],
  webPlugins = [],
  i18nMessages = {},
}: CreateConfigArgsType): webpack.Configuration[] {
  const config: webpack.Configuration[] = [];
  if (!schemaOnly) {
    const webConfig = createWebConfig({
      webOutputPath,
      htmlPath,
      schemaPath,
      cmsConfig,
      resolveLoaderModules,
      resolveModules,
      tsConfigFile,
      appPath,
      plugins: webPlugins,
      authPath,
      i18nMessages
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
