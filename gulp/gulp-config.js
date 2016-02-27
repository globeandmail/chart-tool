var p = require("../package.json");

var libPath           = "./src",
    libScripts        = libPath + "/js"
    libStylesheets    = libPath + "/styles",
    libSettings       = libPath + "/js/config/chart-settings.js",
    customPath        = "./custom",

    meteorPort        = 3000,
    browserSyncPort   = 3030,
    browserSyncUIPort = 3060,

    buildPath         = "./dist/" + p.version,
    buildJsFilename   = "bundle",
    buildCssFilename  = "bundle",

    meteorPath        = "./meteor",
    meteorBundle      = meteorPath + "/lib/charts/scripts",
    meteorSettings    = meteorPath + "/lib/config/settings.js",
    meteorBuildPath   = "." + buildPath + "/meteor",

module.exports = {
  libPath: libPath,
  libScripts: libScripts,
  libStylesheets: libStylesheets,
  libSettings: libSettings,
  customPath: customPath,

  meteorPort: meteorPort,
  browserSyncPort: browserSyncPort,
  browserSyncUIPort: browserSyncUIPort,

  meteorPath: meteorPath,
  meteorBundle: meteorBundle,
  meteorSettings: meteorSettings,
  meteorBuildPath: meteorBuildPath,

  buildPath: buildPath,
  buildJsFilename: buildJsFilename,
  buildCssFilename: buildCssFilename
}
