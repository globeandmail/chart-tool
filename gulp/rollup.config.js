const json = require('rollup-plugin-json');
const buble = require('rollup-plugin-buble');
const gulpConfig = require('./gulp.config.js');
const nodeResolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const replace = require('rollup-plugin-replace');

module.exports = {
  entry: `${gulpConfig.libScripts}/index.js`,
  plugins: [
    json(),
    buble({
      exclude: ['node_modules/**', '*.json']
    }),
    replace({
      s3_bucket: JSON.stringify(process.env.S3_CHARTTOOL_BUCKET)
    }),
    nodeResolve({ jsnext: true }),
    commonjs()
  ]
};
