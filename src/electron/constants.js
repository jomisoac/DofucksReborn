var exports = module.exports = {};

const host = 'https://proxyconnection.touch.dofus.com';
const updateHost = 'http://dofucks.com';

exports.host = host;
exports.manifestUrl = host+'/manifest.json';
exports.assetMapUrl = host+'/assetMap.json';
exports.rootDir = __dirname+'/../..';
exports.patchUrl = updateHost+'/patch';
exports.appUrl = updateHost+'/app.asar';