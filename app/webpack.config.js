const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./src/js/index.js",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new CopyWebpackPlugin([{ from: "./src/index.html", to: "index.html" }]),
  ],
  devServer: { contentBase: path.join(__dirname, "dist"), compress: true },

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
