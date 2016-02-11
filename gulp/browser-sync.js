var gulp = require("gulp"),
    browserSync = require("browser-sync");

var gulpConfig = require('./gulp-config.js');

var webpack = require("./webpack.js");
var css = require("./css.js");

gulp.task("_browserSyncWatch", ["_scss", "_webpack-build-dev"], browserSync.reload);

gulp.task('_browsersync', ["_browserSyncWatch"], function() {
  browserSync({
    port: gulpConfig.browserSyncPort,
    ui: { port: gulpConfig.browserSyncUIPort },
    server: {
      baseDir: "./",
      open: false
    }
  });

  gulp.watch([gulpConfig.libScripts + "/**/*", gulpConfig.libStylesheets + "/**/*"], ["_browserSyncWatch"]);

});
