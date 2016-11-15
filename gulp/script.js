const gulp = require('gulp');
const del = require('del');
const runSequence = require('run-sequence').use(gulp);
const rollupConfig = require('./rollup.config.js');
const gulpConfig = require('./gulp.config.js');
const uglify = require('rollup-plugin-uglify');
const eslint = require('rollup-plugin-eslint');
const strip = require('rollup-plugin-strip');
const rollup = require('rollup').rollup;

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

gulp.task('rollup:dev', () => {
  const rConfig = Object.assign({}, rollupConfig);
  // const replaceObj = {};
  // replaceObj[hotlineConfig.middlewarePath] = 'http://localhost:8080';
  // rConfig.plugins.push(
  //   replace({
  //     include: 'hotline-config.json',
  //     values: replaceObj
  //   })
  // );
  return rollup(rConfig).then(bundle => {
    return bundle.write({
      format: 'iife',
      sourceMap: true,
      dest: `${gulpConfig.buildPathDev}/chart-tool.js`,
      moduleName: 'chartToolInit'
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
      format: 'iife',
      dest: `${gulpConfig.buildPath}/chart-tool.min.js`,
      moduleName: 'chartToolInit'
    });
  });
});
