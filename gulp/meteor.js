import gulp from 'gulp';
import shell from 'gulp-shell';
import { meteorPath } from './gulp.config.js';

export function meteorDev() {
  return shell.task([`cd ${meteorPath} && meteor`]);
}
