var gulp = require("gulp"),
    gutil = require("gulp-util"),
    rename = require('gulp-rename'),
    clean = require("gulp-clean"),
    webpack = require('webpack-stream'),
    runSequence = require('run-sequence').use(gulp),
    webpackConfig = require("./webpack.config.js"),
    gulpConfig = require("./gulp-config.js");

gulp.task('_js-build', function(done) {
  runSequence(
    "_clean-meteorbundle",
    "_clean-buildpath",
    '_webpack-build',
    '_move-d3',
    '_clean-meteorsettings',
    done);
});

gulp.task("_clean-meteorbundle", function() {
  return gulp.src(gulpConfig.meteorBundle, { read: false})
    .pipe(clean());
});

gulp.task("_clean-buildpath", function() {
  return gulp.src(gulpConfig.buildPath, { read: false})
    .pipe(clean());
});

gulp.task("_move-d3", function() {
  return gulp.src("./lib/d3/d3.min.js")
    .pipe(gulp.dest(gulpConfig.buildPath));
});

gulp.task("_webpack-build", function() {
  return gulp.src(gulpConfig.libScripts + "/index.js")
    .pipe(webpack(webpackConfig.production), null, function(err, stats) {
      if (err) { throw new gutil.PluginError("_webpack-build-dev", err); }
      gutil.log("[_webpack-build-dev]", stats.toString({ colors: true }));
    })
    .pipe(gulp.dest(gulpConfig.buildPath))
    .pipe(gulp.dest(gulpConfig.meteorBundle));
});

gulp.task("_clean-meteorsettings", function(done) {
  return gulp.src(gulpConfig.buildPath + "/meteorSettings.min.js", { read: false})
    .pipe(clean());
});

gulp.task('_js-build-dev', function(done) {
  runSequence(
    "_clean-meteorbundle",
    "_webpack-build-dev",
    done);
});

gulp.task("_webpack-build-dev", function() {
  gulp.src(gulpConfig.libScripts + "/index.js")
    .pipe(webpack(webpackConfig.development), null, function(err, stats) {
      if (err) { throw new gutil.PluginError("_webpack-build-dev", err); }
      gutil.log("[_webpack-build-dev]", stats.toString({ colors: true }));
    })
    .pipe(gulp.dest(gulpConfig.buildPathDev))
    .pipe(gulp.dest(gulpConfig.meteorBundle));
});
