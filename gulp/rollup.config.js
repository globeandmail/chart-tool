import gulpConfig from './gulp.config.js';
import json from '@rollup/plugin-json';
import buble from '@rollup/plugin-buble';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';

const onwarn = warning => {
  // Silence circular dependency warning for moment
  if (warning.code === 'CIRCULAR_DEPENDENCY' && warning.importer.indexOf('node_modules/d3') !== -1) {
    return;
  }
  if (warning.code === 'THIS_IS_UNDEFINED' && !warning.importer) {
    return;
  }
  console.warn(`${warning.message}`);
};

export default class RollupConfig {
  constructor() {
    this.input = `${gulpConfig.libScripts}/index.js`;
    this.onwarn = onwarn;
    this.plugins = [
      json(),
      buble({
        exclude: ['node_modules/**', '*.json']
      }),
      replace({
        S3_BUCKET: JSON.stringify(process.env.S3_CHARTTOOL_BUCKET)
      }),
      nodeResolve({ jsnext: true }),
      commonjs()
    ];
  }
}
