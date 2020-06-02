import { src, dest, series, parallel } from 'gulp';
import gulpConfig from './gulp.config.js';
import del from 'del';
import { argv } from 'yargs';
import jeditor from 'gulp-json-editor';
import shell from 'gulp-shell';
import replace from 'gulp-replace';
import size from 'gulp-size';

export function setNodeEnvDev(done) {
  process.env.NODE_ENV = 'development';
  done();
}

export function setNodeEnvProd(done) {
  process.env.NODE_ENV = 'production';
  done();
}

export function buildSize() {
  return src(`${gulpConfig.buildPath}/**/*`)
    .pipe(size({ title: 'Build', gzip: true, showFiles: true }));
}

export function cleanDistDev() {
  return del([`${gulpConfig.buildPathDev}/**/*`], { force: true });
}

export function cleanDistBuild() {
  return del([`${gulpConfig.buildPath}/**/*`], { force: true });
}

export function cleanMeteorBuild() {
  return del([`${gulpConfig.meteorBuildPath}/**/*`], { force: true });
}

export function cleanMeteorLibs() {
  return del([
    `${gulpConfig.meteorBundle}/chart-tool.js`,
    `${gulpConfig.meteorBundle}/settings.js`,
    `${gulpConfig.meteorPath}/imports/ui/style/chart-tool.css`
  ], { force: true });
}

export function setVersion() {
  return src('./README.md')
    .pipe(replace(/## Version\n\n([a-z0-9.]+)/, `## Version\n\n${gulpConfig.version}`))
    .pipe(dest('./'));
}
