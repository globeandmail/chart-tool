import { series, parallel } from 'gulp';
import { scssBuild } from './gulp/css.js'
import { scriptBuild } from './gulp/script.js';
import { server } from './gulp/browser-sync.js'
import { setNodeEnvDev, setNodeEnvProd, buildSize, cleanDistBuild, cleanMeteorLibs } from './gulp/utils.js';

exports.serve = series(setNodeEnvDev, cleanMeteorLibs, server);
exports.build = series(setNodeEnvProd, parallel(cleanDistBuild, cleanMeteorLibs), scriptBuild, scssBuild, buildSize);
