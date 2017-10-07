const fs = require('fs');
const {download} = require('electron-dl');
const {assetMapUrl, publicDir} = require('../constants.js');
var Task = require('./Task');

class AssetMapGetter extends Task {

	constructor(win) {
		super(win);

		this.assets = [];
		this.tries = 0;
	}
		
	checkContent(cb) {
		this.inform("Checking AssetMap...", 20);
		var keys;
		var content = fs.readFileSync(this.path+'/assetMap.json');
		try {
			var mani = JSON.parse(content);
			this.assets = mani.files;
			cb(false);
		} catch (e) {
			console.log(e);
			this.do(cb);
		}
	}

	do(cb) {
		var text = "Downloading UI map file...";
		if (++this.tries > 1) {
			text = "Downloading UI map file ("+this.tries+")...";
		}
		if (this.tries > 3) {
			return cb(true);
		}
		this.inform(text, 15);
		download(this.win, assetMapUrl, {
			filename: 'assetMap.json',
			directory: this.path
		}).then((res) => {
			this.checkContent(cb);
		}).catch((err) => {
			cb(true);
		});
	}
}

module.exports = AssetMapGetter;