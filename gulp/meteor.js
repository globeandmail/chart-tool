var gulp = require('gulp'),
    shell = require('gulp-shell')
    gulpConfig = require('./gulp-config.js');

gulp.task('_meteor-dev', shell.task([
  'cd meteor && meteor'
]));

gulp.task('_meteor-build', shell.task([
  'cd ' + gulpConfig.meteorPath + ' && meteor --verbose  build   ' + gulpConfig.meteorBuildPath + ' --architecture os.linux.x86_64',
  'echo Interface build complete at ' + gulpConfig.buildPath + '/meteor'
]));
