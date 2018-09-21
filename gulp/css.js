const gulp = require('gulp');
const gulpConfig = require('./gulp.config.js');
const gutil = require('gulp-util');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const runSequence = require('run-sequence').use(gulp);
const plumber = require('gulp-plumber');
const csso = require('gulp-csso');
const postCss = require('gulp-postcss');
const autoPrefixer = require('autoprefixer');

const sourceCss = `${gulpConfig.libStylesheets}/main.scss`,
  buildCss = gulpConfig.buildPath;

const sassOptions = { onError: console.error.bind(console, 'SCSS error:') };
const autoprefixerOptions = { browsers: ['last 1 version'] };

gulp.task('scss-compile:dev', () => {
  return gulp.src(sourceCss)
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(sass(sassOptions))
    .pipe(postCss([
      autoPrefixer(autoprefixerOptions)
    ]))
    .pipe(sourcemaps.write())
    .pipe(rename('chart-tool.css'))
    .pipe(gulp.dest(`${gulpConfig.meteorPath}/imports/ui/style`))
    .pipe(gulp.dest(`${gulpConfig.buildPathDev}`))
    .on('error', gutil.log);
});

gulp.task('scss-compile:build', () => {
  return gulp.src(sourceCss)
    .pipe(sass(sassOptions))
    .pipe(postCss([
      autoPrefixer(autoprefixerOptions)]
    ))
    .pipe(csso({ debug: true }))
    .pipe(rename('chart-tool.css'))
    .pipe(gulp.dest(`${gulpConfig.meteorPath}/imports/ui/style`))
    .pipe(rename('chart-tool.min.css'))
    .pipe(gulp.dest(buildCss))
    .on('error', gutil.log);
});

gulp.task('scss-settings', () => {
  return gulp.src(`${gulpConfig.libStylesheets}/settings/_settings.scss`)
    .pipe(gulp.dest(`${gulpConfig.meteorPath}/imports/ui/style/partials`));
});

gulp.task('scss-custom-meteor-before', () => {
  return gulp.src(`${gulpConfig.customPath}/base.scss`)
    .pipe(rename('_custom-settings.scss'))
    .pipe(gulp.dest(`${gulpConfig.meteorPath}/imports/ui/style/partials`));
});

gulp.task('scss-custom-meteor-after', () => {
  return gulp.src(`${gulpConfig.customPath}/meteor-custom.scss`)
    .pipe(rename('_custom.scss'))
    .pipe(gulp.dest(`${gulpConfig.meteorPath}/imports/ui/style/partials`));
});

gulp.task('scss:build', done => {
  runSequence('scss-compile:build',
    'scss-settings',
    'scss-custom-meteor-before',
    'scss-custom-meteor-after',
    done);
});

gulp.task('scss:dev', done => {
  runSequence('scss-compile:dev',
    'scss-settings',
    'scss-custom-meteor-before',
    'scss-custom-meteor-after',
    done);
});
