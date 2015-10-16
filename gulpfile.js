'use strict';

var gulp = require("gulp");

var runSequence = require('run-sequence'),
    webpack = require("./gulp/webpack.js"),
    meteor = require("./gulp/meteor.js"),
    css = require("./gulp/css.js"),
    browser = require("./gulp/browser-sync.js"),
    utils = require("./gulp/utils.js");

gulp.task('documentation', ['_jsdoc']);
gulp.task('set-version', ["_set-version"]);

gulp.task('lib-serve', function(callback) {
  runSequence('_set-version',
    ['_watch', '_webpack-build-dev', '_browsersync'],
    callback);
});

gulp.task('meteor-serve', function(callback) {
  runSequence('_set-version',
    ['_watch', '_meteor-dev', '_browsersync'],
    callback);
});

gulp.task('meteor-build', function(callback) {
  runSequence('_set-version',
    '_clean-meteor',
    '_meteor-build',
    callback);
});

gulp.task('lib-build', function(callback) {
  runSequence('_set-version',
    '_clean-lib',
    '_webpack-build',
    '_scss-build',
    callback);
});

gulp.task('default', function(callback) {
  runSequence('_set-version',
    ['_watch', '_webpack-build-dev', '_browsersync', '_meteor-dev'],
    callback);
});
