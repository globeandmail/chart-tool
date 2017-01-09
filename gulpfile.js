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
    'set-dev-node-env',
    'browsersync',
    done);
});

gulp.task('meteor-serve', done => {
  runSequence('set-version',
    'set-dev-node-env',
    'clean-meteor-libs',
    'meteor:dev',
    'browsersync',
    done);
});

gulp.task('meteor-build', done => {
  runSequence('set-version',
    'set-prod-node-env',
    'clean-dist:build',
    'clean-meteor-libs',
    'js:build',
    'scss:build',
    'move-meteor:build',
    'clean-dist:build',
    'meteor:build',
    done);
});

gulp.task('lib-build', done => {
  runSequence('set-version',
    'set-prod-node-env',
    'clean-dist:build',
    'js:build',
    'scss:build',
    'size:build',
    done);
});

gulp.task('build', done => {
  runSequence('set-version',
    'set-prod-node-env',
    'clean-meteor-libs',
    'clean-dist:build',
    'js:build',
    'scss:build',
    'meteor:build',
    done);
});

gulp.task('default', done => {
  runSequence('set-version',
    'set-dev-node-env',
    'clean-meteor-libs',
    'browsersync',
    'meteor:dev',
    done);
});
