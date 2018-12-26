import tsImportPluginFactory from 'ts-import-plugin';
import path from 'path';

export const ENTRY_PATH = path.join(__dirname, 'index.tsx');
export const HTML_PATH = path.join(__dirname, 'statics/index.html');
export const WINDOW_VARS_PATH = path.join(__dirname, 'windowVars.ts');
export const SCHEMA_PATH = path.join(__dirname, 'statics/schema/canner.schema.js');
export const SCHEMA_OUTPUT_PATH = path.join(__dirname, '../dist');
export const WEB_OUTPUT_PATH = path.join(__dirname, '../dist');
export const SCHEMA_ONLY = process.env.SCHEMA_ONLY;
export const WEB_ONLY = process.env.WEB_ONLY;

const plugins = [
  [require("@babel/plugin-proposal-decorators"), { "legacy": true }],
  require("@babel/plugin-proposal-function-sent"),
  require("@babel/plugin-proposal-export-namespace-from"),
  require("@babel/plugin-proposal-numeric-separator"),
  require("@babel/plugin-proposal-throw-expressions"),
  require("@babel/plugin-proposal-export-default-from"),
  require("@babel/plugin-syntax-dynamic-import"),
  require("@babel/plugin-syntax-import-meta"),
  [require("@babel/plugin-proposal-class-properties"), { "loose": false }],
  require("@babel/plugin-proposal-json-strings"),
  require("@babel/plugin-transform-modules-commonjs"),
  [require('babel-plugin-import'), {libraryName: 'antd', style: true}]
];

export const tsLoader = {
  oneOf: [{
    test: /canner\.schema\.tsx?$/,
    use: [{
      loader: "canner-schema-loader"
    }, {
      loader: 'ts-loader',
      options: {
        compilerOptions: {
          "jsx": "react",
          "jsxFactory": "CannerScript"
        }
      }
    }]
  }, {
    test: /\.tsx?$/,
    loader: 'ts-loader',
    options: {
      transpileOnly: true,
      getCustomTransformers: () => ({
        before: [tsImportPluginFactory({
          libraryName: 'antd',
          style: true,
        })]
      }),
      compilerOptions: {
        module: 'es2015'
      }
    }
  }]
};

export const babelLoader = {
  oneOf: [{
    test: /(\.schema\.js|canner\.def\.js)$/,
    use: [{
      loader: "canner-schema-loader"
    }, {
      loader: "babel-loader",
      options: {
        babelrc: false,
        presets: [
          "@babel/preset-env",
          [
            "@babel/preset-react",
            {
              "pragma": "CannerScript", // default pragma is React.createElement
              "pragmaFrag": "CannerScript.Default", // default is React.Fragment
              "throwIfNamespace": false // defaults to true
            }
          ],
          "@babel/preset-flow"
        ],
        plugins
      }
    }]
  }, {
    test: /\.js$/,
    exclude: /node_modules/,
    use: {
      loader: "babel-loader",
      options: {
        babelrc: false,
        presets: [
          require("@babel/preset-env"),
          require("@babel/preset-react"),
          require("@babel/preset-flow")
        ],
        plugins
      }
    }
  }]
};