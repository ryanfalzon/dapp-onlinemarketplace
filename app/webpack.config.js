const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  context: __dirname + '/src',
  entry: [
    './js/index.js'
  ],
  output:{
    path: __dirname + '/src',
    filename: 'bundle.js'
  },

  module: {
    rules: [
      {test: /\.js$/, loader: "babel-loader", exclude: /node_modules/},
      {test: /\.html$/, loader: "raw-loader", exclude: /node_modules/}
    ]
  },

  optimization: {
    minimize: false
  }
};
