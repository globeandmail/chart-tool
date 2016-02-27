var gulp = require('gulp'),
    gutil = require("gulp-util"),
    sass = require('gulp-sass'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    minifyCss = require('gulp-minify-css');

var gulpConfig = require('./gulp-config.js');

var sourceCss = gulpConfig.libStylesheets + '/main.scss';
var buildCss = gulpConfig.buildPath;

gulp.task('_scss', function() {
  gulp.src(sourceCss)
    .pipe(sass())
    .pipe(gulp.dest(gulpConfig.meteorPath + '/lib/charts/stylesheets'))
    .pipe(gulp.dest(gulpConfig.libStylesheets + "/build"));

  gulp.src(gulpConfig.libStylesheets + "/settings/_settings.scss")
    .pipe(gulp.dest(gulpConfig.meteorPath + "/client/stylesheets/partials"));

  gulp.src(gulpConfig.customPath + "/base.scss")
    .pipe(rename("_custom-settings.scss"))
    .pipe(gulp.dest(gulpConfig.meteorPath + "/client/stylesheets/partials"));

  gulp.src(gulpConfig.customPath + "/meteor-custom.scss")
    .pipe(rename("_custom.scss"))
    .pipe(gulp.dest(gulpConfig.meteorPath + "/client/stylesheets/partials"));
});

gulp.task('_scss-build', function() {
  gulp.src(sourceCss)
    .pipe(sass())
    .pipe(minifyCss({ keepBreaks: false }))
    .pipe(rename(gulpConfig.buildCssFilename + ".min.css"))
    .pipe(gulp.dest(buildCss))
      .on('error', gutil.log);
});
