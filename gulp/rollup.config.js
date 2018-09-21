const json = require('rollup-plugin-json');
const buble = require('rollup-plugin-buble');
const gulpConfig = require('./gulp.config.js');
const nodeResolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const replace = require('rollup-plugin-replace');

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

class RollupConfig {
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

module.exports = RollupConfig;
