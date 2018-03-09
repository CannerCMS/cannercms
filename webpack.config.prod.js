module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /canner\.schema\.js$/,
        use: [{
          loader: '@canner/canner-schema-loader',
        }, {
          loader: 'babel-loader',
        }],
      },
    ],
  },
}
