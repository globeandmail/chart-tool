import { series, src, dest } from 'gulp';
import del from 'del';
import RollupConfig from './rollup.config.js';
import gulpConfig from './gulp.config.js';
import chartToolConfig from '../custom/chart-tool-config.json';
import { rollup } from 'rollup';
import { uglify } from 'rollup-plugin-uglify';
import { eslint } from 'rollup-plugin-eslint';
import strip from '@rollup/plugin-strip';
import replace from '@rollup/plugin-replace';
import rename from 'gulp-rename';

export const scriptBuild = series(
  cleanBuildPath,
  rollupBuild,
  rollupMeteorBuild,
  moveMeteorBuild
);

export const scriptDev = series(
  rollupDev,
  rollupMeteorDev,
  moveMeteorDev
);

export function moveMeteorDev() {
  return src(`${gulpConfig.buildPathDev}/chart-tool.js`)
    .pipe(dest(gulpConfig.meteorBundle));
}

export function moveMeteorBuild() {
  return src(`${gulpConfig.buildPath}/chart-tool.min.js`)
    .pipe(rename('chart-tool.js'))
    .pipe(dest(gulpConfig.meteorBundle));
}

function cleanBuildPath() {
  return del([`${gulpConfig.buildpath}/**/*.js`], { force: true });
}

async function rollupDev(done) {
  const rConfig = new RollupConfig();
  const replaceObj = {};
  replaceObj[chartToolConfig.embedJS] = '../dist/dev/chart-tool.js';
  replaceObj[chartToolConfig.embedCSS] = '../dist/dev/chart-tool.css';
  rConfig.plugins.push(
    replace({
      include: 'chart-tool-config.json',
      values: replaceObj
    })
  );
  const bundle = await rollup(rConfig);
  await bundle.write({
    file: `${gulpConfig.buildPathDev}/chart-tool.js`,
    format: 'umd',
    name: 'ChartToolInit',
    sourcemap: true,
    banner: `/* Chart Tool v${gulpConfig.version}-${gulpConfig.build} | https://github.com/globeandmail/chart-tool | MIT */`
  });
  done();
}

async function rollupMeteorDev(done) {
  const rConfig = new RollupConfig();
  rConfig.input = `${gulpConfig.customPath}/meteor-config.js`;
  const replaceObj = {};
  replaceObj[chartToolConfig.embedJS] = '../dist/dev/chart-tool.js';
  replaceObj[chartToolConfig.embedCSS] = '../dist/dev/chart-tool.css';
  rConfig.plugins.push(
    replace({
      include: 'chart-tool-config.json',
      values: replaceObj
    })
  );
  const bundle = await rollup(rConfig);
  await bundle.write({
    format: 'es',
    file: `${gulpConfig.meteorSettings}`,
    name: 'meteorSettings'
  });
  done();
}

async function rollupBuild(done) {
  const rConfig = new RollupConfig();
  rConfig.plugins.splice(1, 0, eslint({ exclude: ['node_modules/**', '**/*.json'] }));
  rConfig.plugins.push(
    strip({
      debugger: true,
      functions: ['assert.*', 'debug', 'alert'],
      sourceMap: false
    }),
    uglify({
      output: {
        preamble: `/* Chart Tool v${gulpConfig.version}-${gulpConfig.build} | https://github.com/globeandmail/chart-tool | @license MIT */`
      }
    })
  );
  const bundle = await rollup(rConfig);
  await bundle.write({
    banner: `/* Chart Tool v${gulpConfig.version}-${gulpConfig.build} | https://github.com/globeandmail/chart-tool | MIT */`,
    format: 'umd',
    file: `${gulpConfig.buildPath}/chart-tool.min.js`,
    name: 'ChartToolInit'
  });
  done();
}

async function rollupMeteorBuild(done) {
  const rConfig = new RollupConfig();
  rConfig.input = `${gulpConfig.customPath}/meteor-config.js`;
  rConfig.plugins.splice(1, 0, eslint({ exclude: ['node_modules/**', '**/*.json'] }));
  rConfig.plugins.push(
    strip({
      debugger: true,
      functions: ['assert.*', 'debug', 'alert'],
      sourceMap: false
    })
  );
  const bundle = await rollup(rConfig);
  await bundle.write({
    format: 'es',
    file: `${gulpConfig.meteorSettings}`,
    name: 'meteorSettings'
  });
  done();
}
