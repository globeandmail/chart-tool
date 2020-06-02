const { version, buildVer } = require('../package.json');

const libPath = './src',
  meteorPath = './app',
  meteorBundle = `${meteorPath}/imports/modules`,
  meteorSettings = `${meteorBundle}/settings.js`,
  buildPath = `./dist/${version}`;

export default {
  version,
  build: buildVer,

  libPath,
  libScripts: `${libPath}/js`,
  libStylesheets: `${libPath}/styles`,
  libSettings: `${libPath}/js/config/chart-settings.js`,
  customPath: './custom',

  meteorPort: 3000,
  browserSyncPort: 3030,
  browserSyncUIPort: 3060,

  meteorPath,
  meteorBundle,
  meteorSettings,
  meteorBuildPath: `.${buildPath}/app`,

  buildPath,
  buildPathDev: './dist/dev',
  buildJsFilename: 'bundle',
  buildCssFilename: 'bundle'
};
