import { series, parallel } from 'gulp';
import { scssBuild } from './gulp/css.js'
import { scriptBuild } from './gulp/script.js';
import { meteorDev } from './gulp/meteor.js';
import { server } from './gulp/browser-sync.js'
import { setNodeEnvDev, setNodeEnvProd, buildSize, cleanDistBuild, cleanMeteorLibs } from './gulp/utils.js';

exports.libServe = series(setNodeEnvDev, server);
exports.meteorServe = series(setNodeEnvDev, cleanMeteorLibs, scriptBuild, scssBuild, meteorDev);
exports.meteorPrebuild = series(setNodeEnvProd, cleanDistBuild, cleanMeteorLibs, scriptBuild, scssBuild);
exports.libBuild = series(setNodeEnvProd, cleanDistBuild, scriptBuild, scssBuild, buildSize);
exports.default = series(setNodeEnvDev, cleanMeteorLibs, server, meteorDev);
