const gulp = require('gulp');
const browserSync = require('browser-sync');
const gulpConfig = require('./gulp.config.js');
const script = require('./script.js');
const css = require('./css.js');

gulp.task('scss:watch', ['scss:dev'], done => {
  browserSync.reload();
  done();
});

gulp.task('scripts:watch', ['js:dev'], done => {
  browserSync.reload();
  done();
});

gulp.task('browsersync', ['clean-dist:dev', 'js:dev', 'scss:dev'], () => {

  browserSync({
    port: gulpConfig.browserSyncPort,
    ui: { port: gulpConfig.browserSyncUIPort },
    server: {
      baseDir: './',
      open: false
    },
    ghostMode: false
  });

  gulp.watch(
    [
      `${gulpConfig.libScripts}/**/*.js`,
      `${gulpConfig.customPath}/**/*.js`,
      `${gulpConfig.customPath}/**/*.json`
    ], ['scripts:watch']
  );
  gulp.watch(
    [
      `${gulpConfig.libStylesheets}/**/*.scss`,
      `${gulpConfig.customPath}/**/*.scss`
    ], ['scss:watch']
  );

});
