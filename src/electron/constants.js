var exports = module.exports = {};

const host = 'https://proxyconnection.touch.dofus.com';

exports.host = host;
exports.manifestUrl = host+'/manifest.json';
exports.assetMapUrl = host+'/assetMap.json';
exports.rootDir = __dirname+'/../..';
