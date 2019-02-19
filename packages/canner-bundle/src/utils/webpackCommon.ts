import tsImportPluginFactory from 'ts-import-plugin';
import path from 'path';

// must require babel plugin and preset, or it will throw the Can't resolve module error in CLI
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

export const createTsLoader: any = ({
  configFile
}: {
  configFile: string
}) => ({
  oneOf: [{
    test: /canner\.schema\.tsx?$/,
    use: [{
      loader: "canner-schema-loader"
    }, {
      loader: 'ts-loader',
      options: {
        transpileOnly: true,
        compilerOptions: {
          "jsx": "react",
          "jsxFactory": "CannerScript"
        },
        configFile
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
      },
      configFile
    }
  }]
});
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
          require("@babel/preset-env"),
          [
            require("@babel/preset-react"),
            {
              "pragma": "CannerScript", // default pragma is React.createElement
              "pragmaFrag": "CannerScript.Default", // default is React.Fragment
              "throwIfNamespace": false // defaults to true
            }
          ],
          require("@babel/preset-flow")
        ],
        plugins,
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
        plugins,
      }
    }
  }]
};

export class CustomFilterPlugin {
  exclude: any;
  constructor({ exclude }) {
    this.exclude = exclude;
  }

  apply(compiler) {
    compiler.hooks.afterEmit.tap('CustomFilterPlugin', compilation => {
      compilation.warnings = compilation.warnings.filter(warning => !this.exclude.test(warning.message));
    });
  }
};
