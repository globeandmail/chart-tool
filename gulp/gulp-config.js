var p = require("../package.json");

var libPath           = "./src",
    libScripts        = libPath + "/js"
    libStylesheets    = libPath + "/styles",
    libSettings       = libPath + "/js/config/chart-settings.js",

    meteorPort        = 3000,
    browserSyncPort   = 3030,
    browserSyncUIPort = 3060,

    buildPath         = "./dist",
    buildCssPath      = buildPath + "/lib/" + p.version,
    buildCssFilename  = "gm-chart-lib.css";

    meteorPath        = "./meteor",
    meteorBundle      = meteorPath + "/lib/charts/scripts",
    meteorSettings    = meteorPath + "/lib/settings.js",
    meteorBuildPath   = buildPath + "/meteor",

module.exports = {
  libPath: libPath,
  libScripts: libScripts,
  libStylesheets: libStylesheets,
  libSettings: libSettings,

  meteorPort: meteorPort,
  browserSyncPort: browserSyncPort,
  browserSyncUIPort: browserSyncUIPort,

  meteorPath: meteorPath,
  meteorBundle: meteorBundle,
  meteorSettings: meteorSettings,
  meteorBuildPath: meteorBuildPath,

  buildPath: buildPath,
  buildCssPath: buildCssPath,
  buildCssFilename: buildCssFilename
}