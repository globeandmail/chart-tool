var gulp = require('gulp'),
    gutil = require("gulp-util"),
    sass = require('gulp-sass'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    minifyCss = require('gulp-minify-css'),
    runSequence = require('run-sequence').use(gulp);

var gulpConfig = require('./gulp-config.js');

var sourceCss = gulpConfig.libStylesheets + '/main.scss';
var buildCss = gulpConfig.buildPath;

gulp.task('_scss', function(done) {
  runSequence('_scss-dev',
    '_scss-settings',
    '_scss-custom-meteor-before',
    '_scss-custom-meteor-after',
    done);
});

gulp.task('_scss-dev', function() {
  return gulp.src(sourceCss)
    .pipe(sass())
    .pipe(gulp.dest(gulpConfig.meteorPath + '/lib/chart-tool/stylesheets'))
    .pipe(gulp.dest(gulpConfig.libStylesheets + "/build"));
});

gulp.task('_scss-settings', function() {
  return gulp.src(gulpConfig.libStylesheets + "/settings/_settings.scss")
    .pipe(gulp.dest(gulpConfig.meteorPath + "/client/stylesheets/partials"));
});

gulp.task('_scss-custom-meteor-before', function() {
  return gulp.src(gulpConfig.customPath + "/base.scss")
    .pipe(rename("_custom-settings.scss"))
    .pipe(gulp.dest(gulpConfig.meteorPath + "/client/stylesheets/partials"));
});

gulp.task('_scss-custom-meteor-after', function() {
  return gulp.src(gulpConfig.customPath + "/meteor-custom.scss")
    .pipe(rename("_custom.scss"))
    .pipe(gulp.dest(gulpConfig.meteorPath + "/client/stylesheets/partials"));
});

gulp.task('_scss-build', function() {
  return gulp.src(sourceCss)
    .pipe(sass())
    .pipe(minifyCss({ keepBreaks: false }))
    .pipe(rename(gulpConfig.buildCssFilename + ".min.css"))
    .pipe(gulp.dest(buildCss))
      .on('error', gutil.log);
});
