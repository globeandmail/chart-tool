var path = require("path"),
    webpack = require("webpack"),
    gulpConfig = require("./gulp-config.js");

module.exports = {
  cache: true,
  entry: {
    bundle: gulpConfig.libScripts + "/index",
    meteorSettings: "./custom/meteor-config.js"
  },
  output: {
    path: gulpConfig.buildPath,
    filename: "[name].js",
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