var gulp = require("gulp"),
    clean = require("gulp-clean"),
    args = require('yargs').argv,
    jeditor = require("gulp-json-editor"),
    opn = require("opn"),
    shell = require("gulp-shell"),
    replace = require('gulp-replace'),
    gulpConfig = require("./gulp-config.js");

var p = require("../package.json");

gulp.task('_clean-lib', function() {
  return gulp.src(gulpConfig.buildPath, {
      read: false
  }).pipe(clean());
});

gulp.task('_clean-meteor', function() {
  return gulp.src(gulpConfig.meteorBuildPath, {
      read: false
  }).pipe(clean());
});

gulp.task("_jsdoc", shell.task([
  "./node_modules/.bin/jsdoc -c ./jsdoc.json ./src"
]));

gulp.task('_set-version', function() {
  gulp.src("./README.md")
    .pipe(replace(/### Version\n\n([a-z0-9.]+)/, "### Version\n\n" + p.version))
    .pipe(gulp.dest('./'));

  gulp.src(gulpConfig.libSettings)
    .pipe(replace(/version: '([a-z0-9.]+)'/, "version: '" + p.version + "'"))
    .pipe(replace(/build: '([a-z0-9.]+)'/, "build: '" + p.buildVer + "'"))
    .pipe(gulp.dest(gulpConfig.libScripts + "/config/"));

  gulp.src(gulpConfig.libScripts + "/index.js")
    .pipe(replace(/\s\*\s@version\s([a-z0-9.]+)/, " * @version " + p.version))
    .pipe(gulp.dest(gulpConfig.libScripts));

  gulp.src(gulpConfig.meteorSettings)
    .pipe(replace(/app_version.*/, "app_version = '" + p.version + "';"))
    .pipe(replace(/app_build.*/, "app_build = '" + p.buildVer + "';"))
    .pipe(gulp.dest(gulpConfig.meteorPath + "/lib/"));
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
  gulp.watch(gulpConfig.libScripts + "/**/*", ["_webpack-build-dev"]);
  gulp.watch(gulpConfig.libStylesheets + "/**/*", ['_scss']);
  gulp.watch("./custom/**/*", ["_webpack-build-dev", '_scss']);
  done();
});
