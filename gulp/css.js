var gulp = require('gulp'),
    gutil = require("gulp-util"),
    sass = require('gulp-sass'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    minifyCss = require('gulp-minify-css');

var gulpConfig = require('./gulp-config.js');

var sourceCss = gulpConfig.libStylesheets + '/main.scss';
var buildCss = gulpConfig.buildCssPath + "/css";

gulp.task('_scss', function() {
  gulp.src(sourceCss)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(gulpConfig.meteorPath + '/lib/charts/stylesheets'))
    .pipe(gulp.dest(gulpConfig.libStylesheets + "/build"));

  gulp.src(gulpConfig.libStylesheets + "/settings/_settings.scss")
    .pipe(gulp.dest(gulpConfig.meteorPath + "/client/stylesheets/partials"));
});

gulp.task('_scss-build', function() {
  gulp.src(sourceCss)
    .pipe(sass())
      .pipe(sourcemaps.init())
    .pipe(rename(gulpConfig.buildCssFilename))
    .pipe(gulp.dest(buildCss))
    .pipe(minifyCss({ keepBreaks: false }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(buildCss))
      .on('error', gutil.log);
});
