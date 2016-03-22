var path = require("path"),
    webpack = require("webpack"),
    gulpConfig = require("./gulp-config.js");

var dev = {
  cache: true,
  debug: true,
  watch: true,
  devtool: "inline-source-map",
  entry: {
    bundle: gulpConfig.libScripts + "/index",
    meteorSettings: gulpConfig.customPath + "/meteor-config"
  },
  output: {
    filename: "[name].js"
  },
  module: {
    loaders: []
  },
  resolve: {
    extensions: ['', '.js', '.sjs'],
    fallback: __dirname
  },
  plugins: [
    new webpack.DefinePlugin({
      s3_bucket: JSON.stringify(process.env.S3_CHARTTOOL_BUCKET)
    })
  ]
};

var prod = {
  cache: false,
  entry: {
    bundle: gulpConfig.libScripts + "/index",
    meteorSettings: gulpConfig.customPath + "/meteor-config"
  },
  output: {
    filename: "[name].min.js"
  },
  module: {
    loaders: []
  },
  resolve: {
    extensions: ['', '.js', '.sjs'],
    fallback: __dirname
  },
  plugins: [
    new webpack.DefinePlugin({
      s3_bucket: JSON.stringify(process.env.S3_CHARTTOOL_BUCKET_PROD)
    }),
    new webpack.DefinePlugin({
      "process.env": {
        // This has effect on the react lib size
        "NODE_ENV": JSON.stringify("production")
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true,
        warnings: true
      }
    })
  ]
};

module.exports = {
  development: dev,
  production: prod
};
