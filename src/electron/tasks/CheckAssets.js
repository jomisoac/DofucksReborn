const fs = require('fs');
const {download} = require('electron-dl');
const {publicDir} = require('../constants.js');
var Task = require('./Task');

class CheckAssets extends Task {

	constructor(win, assets, assets2) {
		super(win);
		this.assets = assets;
		this.assets2 = assets2;
		this.toDownload = [];
		this.assetsToDownload = [];
		this.versions = {};
	}

	loadCurrentManifestVersions() {
		var keys = Object.keys(this.assets);
		try {
			var content = fs.readFileSync(this.path+'/versions.json');
			try {
				var v = JSON.parse(content);
				this.versions = v;
				for (var i = 0; i < keys.length; i++) {
					var asset = this.assets[keys[i]];
					if (!v[asset.filename] || v[asset.filename] != asset.version) {
						this.toDownload.push(asset.filename);
					}
				}
				return;
			} catch (e) {}
		} catch (e) {}
		for (var i = 0; i < keys.length; i++) {
			var asset = keys[i];
			this.toDownload.push(asset);
		}

	}

	loadCurrentAssetVersions() {
		var keys = Object.keys(this.assets2);
		try {
			var content = fs.readFileSync(this.path+'/versions.json');
			try {
				var v = JSON.parse(content);
				this.versions = Object.assign(v, this.versions);
				for (var i = 0; i < keys.length; i++) {
					var asset = this.assets2[keys[i]];
					if (!v[asset.filename] || v[asset.filename] != asset.version) {
						this.assetsToDownload.push(asset.filename);
					}
				}
				return;
			} catch (e) {}
		} catch (e) {}
		for (var i = 0; i < keys.length; i++) {
			var asset = keys[i];
			this.assetsToDownload.push(asset);
		}

	}

	do(cb) {
		this.inform("Checking existing assets...", 35);
		this.loadCurrentManifestVersions();
		this.loadCurrentAssetVersions();
		cb();
	}
}

module.exports = CheckAssets;