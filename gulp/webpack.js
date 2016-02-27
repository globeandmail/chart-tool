var gulp = require("gulp"),
    gutil = require("gulp-util"),
    rename = require('gulp-rename'),
    clean = require("gulp-clean"),
    webpack = require("webpack"),
    webpackConfig = require("./webpack.config.js"),
    gulpConfig = require("./gulp-config.js");

gulp.task("_webpack-build", function(callback) {
  // modify some webpack config options
  var myConfig = Object.create(webpackConfig.production);
  myConfig.plugins = myConfig.plugins.concat(
    new webpack.DefinePlugin({
      "process.env": {
        // This has effect on the react lib size
        "NODE_ENV": JSON.stringify("production")
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      mangle: {
        screw_ie8: true
      },
      compress: {
        warnings: true,
        screw_ie8: true
      }
    })
  );

  // run webpack
  webpack(myConfig, function(err, stats) {
    if(err) throw new gutil.PluginError("_webpack-build", err);
    gutil.log("[_webpack-build]", stats.toString({
      colors: true
    }));
    callback();

    // move d3 to folder
    gulp.src("./lib/d3/d3.min.js")
      .pipe(gulp.dest(gulpConfig.buildPath));

    // move build files and meteorSettings to Meteor
    gulp.src(gulpConfig.buildPath + "/bundle.min.js")
      .pipe(gulp.dest(gulpConfig.meteorBundle));

    gulp.src(gulpConfig.buildPath + "/meteorSettings.min.js")
      .pipe(gulp.dest(gulpConfig.meteorPath + '/lib/config/'));

    // cleaning up
    gulp.src(gulpConfig.buildPath + "/meteorSettings.min.js", { read: false })
      .pipe(clean());

  });
});

gulp.task("_webpack-build-dev", function(done) {

  var webpackDevConfig = Object.create(webpackConfig.development);
  webpackDevConfig.devtool = "sourcemap";
  webpackDevConfig.debug = true;

  webpack(webpackDevConfig).run(function(err, stats) {

    if (err) { throw new gutil.PluginError("_webpack-build-dev", err); }

    gutil.log("[_webpack-build-dev]", stats.toString({
      colors: true
    }));

    gulp.src([gulpConfig.buildPathDev + "/bundle.js", gulpConfig.buildPathDev + "/bundle.js.map"])
      .pipe(gulp.dest(gulpConfig.meteorBundle));

    gulp.src([gulpConfig.buildPathDev + "/meteorSettings.js", gulpConfig.buildPathDev + "/meteorSettings.js.map"])
      .pipe(gulp.dest(gulpConfig.meteorPath + '/lib/config/'));

    done();
  });

});
