var gulp = require("gulp"),
    gutil = require("gulp-util"),
    rename = require('gulp-rename'),
    clean = require("gulp-clean"),
    webpack = require("webpack"),
    webpackConfig = require("./webpack.config.js"),
    gulpConfig = require("./gulp-config.js");

gulp.task("_webpack-build", function(callback) {
  // modify some webpack config options
  var myConfig = Object.create(webpackConfig);
  myConfig.plugins = myConfig.plugins.concat(
    new webpack.DefinePlugin({
      "process.env": {
        // This has effect on the react lib size
        "NODE_ENV": JSON.stringify("production")
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin()
  );

  // run webpack
  webpack(myConfig, function(err, stats) {
    if(err) throw new gutil.PluginError("_webpack-build", err);
    gutil.log("[_webpack-build]", stats.toString({
      colors: true
    }));
    callback();

    // rename bundle to bundle.min
    gulp.src(gulpConfig.buildPath + "/bundle.js")
      .pipe(rename(gulpConfig.buildJsFilename + ".min.js"))
      .pipe(gulp.dest(gulpConfig.buildPath));

    // move d3 to folder
    gulp.src("./lib/d3/d3.min.js")
      .pipe(gulp.dest(gulpConfig.buildPath));

    // move build files and meteorSettings to Meteor
    gulp.src([gulpConfig.buildPath + "/bundle.js", gulpConfig.buildPath + "/bundle.js.map"])
      .pipe(gulp.dest(gulpConfig.meteorBundle));

    gulp.src([gulpConfig.buildPath + "/meteorSettings.js", gulpConfig.buildPath + "/meteorSettings.js.map"])
      .pipe(gulp.dest(gulpConfig.meteorPath + '/lib/config/'));

    // cleaning up
    gulp.src(gulpConfig.buildPath + "/meteorSettings.js", { read: false })
      .pipe(clean());

    gulp.src(gulpConfig.buildPath + "/bundle.js", { read: false })
      .pipe(clean());

  });
});

gulp.task("_webpack-build-dev", function(done) {

  var webpackDevConfig = Object.create(webpackConfig);
  webpackDevConfig.devtool = "sourcemap";
  webpackDevConfig.debug = true;

  webpack(webpackDevConfig).run(function(err, stats) {

    if (err) { throw new gutil.PluginError("_webpack-build-dev", err); }

    gutil.log("[_webpack-build-dev]", stats.toString({
      colors: true
    }));

    gulp.src([gulpConfig.buildPath + "/bundle.js", gulpConfig.buildPath + "/bundle.js.map"])
      .pipe(gulp.dest(gulpConfig.meteorBundle));

    gulp.src([gulpConfig.buildPath + "/meteorSettings.js", gulpConfig.buildPath + "/meteorSettings.js.map"])
      .pipe(gulp.dest(gulpConfig.meteorPath + '/lib/config/'));

    done();
  });

});
