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

gulp.task('lib-serve', function(done) {
  runSequence('_set-version',
    '_browsersync',
    done);
});

gulp.task('meteor-serve', function(done) {
  runSequence('_set-version',
    '_meteor-dev',
    '_watch',
    done);
});

gulp.task('meteor-build', function(done) {
  runSequence('_set-version',
    '_js-build',
    '_scss',
    '_clean-meteor',
    '_meteor-build',
    done);
});

gulp.task('lib-build', function(done) {
  runSequence('_set-version',
    '_js-build',
    '_scss-build',
    done);
});

gulp.task('default', function(done) {
  runSequence('_set-version',
    '_browsersync',
    '_meteor-dev',
    done);
});
