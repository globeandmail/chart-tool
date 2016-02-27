var path = require("path"),
    webpack = require("webpack"),
    gulpConfig = require("./gulp-config.js");

var dev = {
  cache: true,
  entry: {
    bundle: gulpConfig.libScripts + "/index",
    meteorSettings: gulpConfig.customPath + "/meteor-config"
  },
  output: {
    path: gulpConfig.buildPathDev,
    filename: "[name].js"
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

var prod = {
  cache: true,
  entry: {
    bundle: gulpConfig.libScripts + "/index",
    meteorSettings: gulpConfig.customPath + "/meteor-config"
  },
  output: {
    path: gulpConfig.buildPath,
    filename: "[name].min.js"
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

module.exports = {
  development: dev,
  production: prod
};
