'use strict';

var gulp = require("gulp");

var webpack = require("./gulp/webpack.js"),
    meteor = require("./gulp/meteor.js"),
    css = require("./gulp/css.js"),
    browser = require("./gulp/browser-sync.js"),
    utils = require("./gulp/utils.js");

gulp.task('documentation', ['_jsdoc']);
gulp.task('set-version', ["_set-version"]);
gulp.task('lib-serve', ["_set-version", "_watch", "_webpack-build-dev", "_browsersync"]);
gulp.task('meteor-serve', ["_set-version", "_watch", "_meteor-dev"]);
gulp.task('meteor-build', ['_set-version','_clean-meteor', '_meteor-build']);
gulp.task('lib-build', ['_set-version', '_clean-lib', '_webpack-build', '_scss-build']);
gulp.task("default",
  [
    "_set-version",
    "_watch",
    "_webpack-build-dev",
    "_browsersync",
    "_meteor-dev"
  ]
);