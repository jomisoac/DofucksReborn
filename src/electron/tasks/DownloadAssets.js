const fs = require('fs');
const {download} = require('electron-dl');
const {publicDir, host} = require('../constants.js');
var Task = require('./Task');

class DownloadAssets extends Task {

	constructor(win, toDownload, assetsToDownload, versions, manifest, assetMap) {
		super(win);
		this.toDownload = toDownload;
		this.assetsToDownload = assetsToDownload;
		this.versions = versions;
		this.manifest = manifest;
		this.assetMap = assetMap;
		this.currentIndex = 0;
		this.currentAssetsIndex = 0;
		this.hasDownloaded = false;
	}

	dlManifestAsset(asset, _cb) {
		this.inform("Downloading new assets : "+asset.split("/").pop()+"...", 20 + this.currentIndex*5);
		download(this.win, host+'/'+asset, {
			directory: this.path+'/build',
			filename: asset.split("/").pop()
		}).then(() => {
			this.hasDownloaded = true;
			this.versions[asset] = this.manifest[asset].version;
			_cb(false);
		}).catch((err) => {
			console.log(err);
			_cb(true);
		});
	}

	dlManifestAssets(cb) {
		var asset = this.toDownload[this.currentIndex++];
		if (!asset) {
			cb();
			return;
		}
		this.dlManifestAsset(asset, err => {
			if (err) {
				console.error("ERROR WHILE DOWNLOADING!", err);
			}
			this.dlManifestAssets(cb);
		})
	}


	dlAsset(asset, _cb) {
		this.inform("Downloading new assets : "+asset.split("/").pop()+"...", 30 + (this.currentAssetsIndex * 100 / this.assetsToDownload.length)/2);
		download(this.win, host+'/'+asset, {
			directory: this.path+'/'+asset.replace(/^(.+)\/([^\/]+)$/, '$1'),
			filename: asset.split("/").pop()
		}).then(() => {
			this.hasDownloaded = true;
			this.versions[asset] = this.assetMap[asset].version;
			_cb(false);
		}).catch((err) => {
			console.log(err);
			_cb(true);
		});
	}

	dlAssets(cb) {
		var asset = this.assetsToDownload[this.currentAssetsIndex++];
		if (!asset) {
			cb();
			return;
		}
		this.dlAsset(asset, err => {
			if (err) {
				console.error("ERROR WHILE DOWNLOADING!", err);
			}
			this.dlAssets(cb);
		})
	}

	do(cb) {
		this.inform("Downloading new assets...", 60);
		this.dlManifestAssets(() => {
			this.dlAssets(() => {
				if (this.hasDownloaded) {
					fs.writeFileSync(this.path+'/versions.json', JSON.stringify(this.versions));
				}
				cb(false, this.hasDownloaded);
			})
		});
	}
}

module.exports = DownloadAssets;