'use strict';

const gulp = require('gulp');
const runSequence = require('run-sequence');
const script = require('./gulp/script.js');
const meteor = require('./gulp/meteor.js');
const css = require('./gulp/css.js');
const browser = require('./gulp/browser-sync.js');
const utils = require('./gulp/utils.js');

gulp.task('lib-serve', done => {
  runSequence('set-version',
    'browsersync',
    done);
});

gulp.task('meteor-serve', done => {
  runSequence('set-version',
    'meteor:dev',
    'browsersync',
    done);
});

gulp.task('meteor-build', done => {
  runSequence('set-version',
    'js:build',
    'scss:build',
    'clean-meteor:build',
    'meteor:build',
    done);
});

gulp.task('lib-build', done => {
  runSequence('_set-version',
    'js:build',
    'scss:build',
    done);
});

gulp.task('default', done => {
  runSequence('set-version',
    'browsersync',
    'meteor:dev',
    done);
});
