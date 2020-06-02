import { series, parallel, watch } from 'gulp';
import gulpConfig from './gulp.config.js';
import browserSync from 'browser-sync';
import { scssDev } from './css.js'
import { cleanDistDev } from './utils.js';
import { scriptDev } from './script.js';

const browserSyncServer = browserSync.create();

function reload(done) {
  browserSyncServer.reload();
  done();
}

function serve(done) {
  browserSyncServer.init({
    port: gulpConfig.browserSyncPort,
    ui: { port: gulpConfig.browserSyncUIPort },
    server: {
      baseDir: './',
      open: false
    },
    ghostMode: false
  });
  done();
}

function watchFiles() {
  watch([
    `${gulpConfig.libScripts}/**/*.js`,
    `${gulpConfig.customPath}/**/*.js`,
    `${gulpConfig.customPath}/**/*.json`
  ], series(scriptDev, reload));

  watch([
    `${gulpConfig.libStylesheets}/**/*.scss`,
    `${gulpConfig.customPath}/**/*.scss`
  ], series(scssDev, reload));
}

export const server = series(cleanDistDev, parallel(scssDev, scriptDev), parallel(watchFiles, serve));
