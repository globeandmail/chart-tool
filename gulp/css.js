import { series, src, dest } from 'gulp';
import gulp from 'gulp';
import gulpConfig from './gulp.config.js';
import gutil from 'gulp-util';
import sass from 'gulp-sass';
import rename from 'gulp-rename';
import sourcemaps from 'gulp-sourcemaps';
import plumber from 'gulp-plumber';
import csso from 'gulp-csso';
import postCss from 'gulp-postcss';
import autoPrefixer from 'autoprefixer';

const sourceCss = `${gulpConfig.libStylesheets}/main.scss`,
  buildCss = gulpConfig.buildPath,
  sassOptions = { onError: console.error.bind(console, 'SCSS error:') };

function scssCompileDev() {
  return src(sourceCss)
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(sass(sassOptions))
    .pipe(postCss([autoPrefixer()]))
    .pipe(sourcemaps.write())
    .pipe(rename('chart-tool.css'))
    .pipe(dest(`${gulpConfig.meteorPath}/imports/ui/style`))
    .pipe(dest(`${gulpConfig.buildPathDev}`))
    .on('error', gutil.log);
}

function scssCompileBuild() {
  return src(sourceCss)
    .pipe(sass(sassOptions))
    .pipe(postCss([
      autoPrefixer(autoprefixerOptions)]
    ))
    .pipe(csso({ debug: true }))
    .pipe(rename('chart-tool.css'))
    .pipe(dest(`${gulpConfig.meteorPath}/imports/ui/style`))
    .pipe(rename('chart-tool.min.css'))
    .pipe(dest(buildCss))
    .on('error', gutil.log);
}

function scssSettings() {
  return src(`${gulpConfig.libStylesheets}/settings/_settings.scss`)
    .pipe(dest(`${gulpConfig.meteorPath}/imports/ui/style/partials`));
}

function scssCustomMeteorBefore() {
  return src(`${gulpConfig.customPath}/base.scss`)
    .pipe(rename('_custom-settings.scss'))
    .pipe(dest(`${gulpConfig.meteorPath}/imports/ui/style/partials`));
}

function scssCustomMeteorAfter() {
  return src(`${gulpConfig.customPath}/meteor-custom.scss`)
    .pipe(rename('_custom.scss'))
    .pipe(dest(`${gulpConfig.meteorPath}/imports/ui/style/partials`));
};

export const scssBuild = series(
  scssCompileBuild,
  scssSettings,
  scssCustomMeteorBefore,
  scssCustomMeteorAfter
);

export const scssDev = series(
  scssCompileDev,
  scssSettings,
  scssCustomMeteorBefore,
  scssCustomMeteorAfter
);
