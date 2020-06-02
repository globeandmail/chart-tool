import { series, parallel } from 'gulp';
import { scssBuild } from './gulp/css.js'
import { scriptBuild } from './gulp/script.js';
import { server } from './gulp/browser-sync.js'
import { setNodeEnvDev, setNodeEnvProd, buildSize, cleanDistBuild, cleanMeteorLibs } from './gulp/utils.js';

exports.libServe = series(setNodeEnvDev, cleanMeteorLibs, server);
exports.meteorPrebuild = series(setNodeEnvProd, parallel(cleanDistBuild, cleanMeteorLibs), scriptBuild, scssBuild);
exports.libBuild = series(setNodeEnvProd, cleanDistBuild, scriptBuild, scssBuild, buildSize);
exports.default = series(setNodeEnvDev, cleanMeteorLibs, server);
