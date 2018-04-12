const gulp = require('gulp');
const shell = require('gulp-shell');
const gulpConfig = require('./gulp.config.js');

gulp.task('meteor:dev', shell.task(['cd meteor && meteor']));

gulp.task('meteor:build', shell.task([
  `cd ${gulpConfig.meteorPath} && meteor --verbose build ${gulpConfig.meteorBuildPath} --architecture os.linux.x86_64 --server-only`,
  `echo Interface build complete at ${gulpConfig.buildPath}/meteor`
]));
