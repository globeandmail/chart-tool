var gulp = require("gulp"),
    clean = require("gulp-clean"),
    args = require('yargs').argv,
    jeditor = require("gulp-json-editor"),
    shell = require("gulp-shell"),
    replace = require('gulp-replace'),
    gulpConfig = require("./gulp-config.js");

var p = require("../package.json");

gulp.task('_clean-meteor', function() {
  return gulp.src(gulpConfig.meteorBuildPath, { read: false })
    .pipe(clean());
});

gulp.task("_jsdoc", shell.task([
  "./node_modules/.bin/jsdoc -c ./jsdoc.json ./src"
]));

gulp.task('_set-version', function(done) {
  return gulp.src("./README.md")
    .pipe(replace(/## Version\n\n([a-z0-9.]+)/, "## Version\n\n" + p.version))
    .pipe(gulp.dest('./'));
});

gulp.task('buildver', function() {
  if (args.set) {
    var val = args.set;
    return gulp.src('./package.json')
      .pipe(jeditor(function(pkg) {
        pkg.buildVer = val.toString();
        return pkg;
      }))
      .pipe(gulp.dest('.'));
  } else {
    return gulp.src('./package.json')
      .pipe(shell([
      'echo ' + p.buildVer
    ]));
  }
});

gulp.task("_watch", ["_webpack-build-dev", "_scss"], function(done) {
  gulp.watch(
    [
      gulpConfig.libScripts + "/**/*.js",
      gulpConfig.customPath + "/**/*.js",
      gulpConfig.customPath + "/**/*.json"
    ], ["_webpack-build-dev"]
  );
  gulp.watch(
    [
      gulpConfig.libStylesheets + "/**/*.scss",
      gulpConfig.customPath + "/**/*.scss"
    ], ['_scss']
  );
  done();
});
