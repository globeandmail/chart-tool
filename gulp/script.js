const gulp = require('gulp');
const del = require('del');
const runSequence = require('run-sequence').use(gulp);
const rollupConfig = require('./rollup.config.js');
const gulpConfig = require('./gulp.config.js');
const chartToolConfig = require('../custom/chart-tool-config.json');
const rollup = require('rollup').rollup;
const uglify = require('rollup-plugin-uglify');
const eslint = require('rollup-plugin-eslint');
const strip = require('rollup-plugin-strip');
const replace = require('rollup-plugin-replace');

gulp.task('js:build', done => {
  runSequence(
    'clean-meteorbundle',
    'clean-buildpath',
    'clean-meteorsettings',
    'rollup:build',
    'move-meteor:build',
    done);
});

gulp.task('js:dev', done => {
  runSequence(
    'clean-meteorbundle',
    'rollup:dev',
    'move-meteor:dev',
    done);
});

gulp.task('clean-meteorbundle', () => {
  return del([`${gulpConfig.meteorBundle}/**/*.js`]);
});

gulp.task('clean-buildpath', () => {
  return del([`${gulpConfig.buildpath}/**/*.js`]);
});

gulp.task('clean-meteorsettings', () => {
  return del([`${gulpConfig.buildPath}/meteorSettings.min.js`]);
});

gulp.task('move-meteor:dev', () => {
  gulp.src(`${gulpConfig.buildPathDev}/chart-tool.js`)
    .pipe(gulp.dest(gulpConfig.meteorBundle));
});

gulp.task('move-meteor:build', () => {
  gulp.src(`${gulpConfig.buildPath}/chart-tool.min.js`)
    .pipe(gulp.dest(gulpConfig.meteorBundle));
});

let cache;

gulp.task('rollup:dev', () => {
  const rConfig = Object.assign({}, rollupConfig);
  rConfig.cache = cache;
  const replaceObj = {};
  replaceObj[chartToolConfig.embedJS] = '../dist/dev/chart-tool.js';
  replaceObj[chartToolConfig.embedCSS] = '../dist/dev/chart-tool.css';
  rConfig.plugins.push(
    replace({
      include: 'chart-tool-config.json',
      values: replaceObj
    })
  );
  return rollup(rConfig).then(bundle => {
    cache = bundle;
    return bundle.write({
      banner: `/* Chart Tool v${gulpConfig.version}-${gulpConfig.build} | https://github.com/globeandmail/chart-tool | MIT */`,
      format: 'iife',
      sourceMap: true,
      dest: `${gulpConfig.buildPathDev}/chart-tool.js`,
      moduleName: 'ChartToolInit'
    });
  });
});

gulp.task('rollup:build', () => {
  const rConfig = Object.assign({}, rollupConfig);
  rConfig.plugins.push(
    uglify(),
    eslint({ exclude: ['node_modules/**', '*.json'] }),
    strip({
      debugger: true,
      functions: ['assert.*', 'debug', 'alert'],
      sourceMap: false
    })
  );
  return rollup(rConfig).then(bundle => {
    return bundle.write({
      banner: `/* Chart Tool v${gulpConfig.version}-${gulpConfig.build} | https://github.com/globeandmail/chart-tool | MIT */`,
      format: 'iife',
      dest: `${gulpConfig.buildPath}/chart-tool.min.js`,
      moduleName: 'ChartToolInit'
    });
  });
});
