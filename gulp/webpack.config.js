var path = require("path"),
    webpack = require("webpack"),
    gulpConfig = require("./gulp-config.js");

module.exports = {
  cache: true,
  entry: {
    index: gulpConfig.libScripts + "/index",
  },
  output: {
    path: gulpConfig.buildPath,
    filename: "bundle.js",
    publicPath: "/assets/"
  },
  module: {
    loaders: []
  },
  resolve: {
    extensions: ['', '.js', '.sjs'],
    fallback: __dirname
  },
  plugins: []
};