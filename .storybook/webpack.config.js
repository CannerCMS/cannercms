const path = require('path');
const babelrc = require('../babel.config');

module.exports = async ({ config, mode }) => {
  // `mode` has a value of 'DEVELOPMENT' or 'PRODUCTION'
  // You can change the configuration based on that.
  // 'PRODUCTION' is used when building the static version of storybook.

  // Make whatever fine-grained changes you need
  // config.module.rules.push({
  //   test: /\.scss$/,
  //   use: ['style-loader', 'css-loader', 'sass-loader'],
  //   include: path.resolve(__dirname, '../'),
  // });

  config.module.rules = [
    {
      test: /\.js$/,
      use: {
        loader: path.resolve(__dirname, "../", "node_modules", "babel-loader"),
        options: {
          babelrc: false,
          ...babelrc
        }
      },
      exclude: /node_modules/
    },
    {
      test: /\.css$/,
      use: [
        {
          loader: "style-loader"
        },
        {
          loader: "css-loader"
        }
      ]
    },
    {
      test: /\.less$/,
      use: [
        {
          loader: "style-loader"
        },
        {
          loader: "css-loader"
        },
        {
          loader: "less-loader",
          options: {
            javascriptEnabled: true
          }
        }
      ]
    }
  ];

  config.resolve = {
    extensions: [".js"],
    alias: {
      packages: path.resolve(__dirname, "../packages"),
      utils: path.resolve(__dirname, "../utils"),
      "styled-components": path.resolve(
        __dirname,
        "../node_modules",
        "styled-components"
      )
    }
  };

  // Return the altered config
  return config;
};
