module.exports = {
  "presets": [
    ["@babel/preset-env", {
      "targets": {
        "browsers": [
          ">0.25%",
          "not ie 11",
          "not op_mini all"
        ],
        "node": "6.10"
      }
    }],
    "@babel/preset-react",
    "@babel/preset-flow"
  ],
  "plugins": [
    "@babel/plugin-transform-runtime",
    [
      "@babel/plugin-proposal-decorators", { "legacy": true }
    ],
    "@babel/plugin-proposal-function-sent",
    "@babel/plugin-proposal-export-namespace-from",
    "@babel/plugin-proposal-numeric-separator",
    "@babel/plugin-proposal-throw-expressions",
    "@babel/plugin-proposal-export-default-from",
    "@babel/plugin-syntax-dynamic-import",
    "@babel/plugin-syntax-import-meta",
    ["@babel/plugin-proposal-class-properties", { "loose": false }],
    "@babel/plugin-proposal-json-strings",
    "@babel/plugin-transform-modules-commonjs",
    ["import", { "libraryName": "antd", "style": true }]
  ]
}