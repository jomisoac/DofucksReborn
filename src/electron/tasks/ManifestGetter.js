const fs = require('fs');
const {download} = require('electron-dl');
const {manifestUrl, publicDir} = require('../constants.js');
var Task = require('./Task');

class ManifestGetter extends Task {

	constructor(win) {
		super(win);

		this.assets = [];
		this.tries = 0;
	}
		
	checkContent(cb) {
		this.inform("Checking manifest...", 10);
		var keys;
		var content = fs.readFileSync(this.path+'/manifest.json');
		try {
			var mani = JSON.parse(content);
			this.assets = mani.files;
			/*if (mani && mani.files && (keys = Object.keys(mani.files)) && keys.length) {
				for (var i = 0; i < keys.length; i++) {
					this.assets.push(mani.files[keys[i]]);
				}
				cb(false);
			}*/
			cb(false);
		} catch (e) {
			console.log(e);
			this.do(cb);
		}
	}

	do(cb) {
		var text = "Downloading configuration file...";
		if (++this.tries > 1) {
			text = "Downloading configuration file ("+this.tries+")...";
		}
		if (this.tries > 3) {
			return cb(true);
		}
		this.inform(text, 5);
		download(this.win, manifestUrl, {
			filename: 'manifest.json',
			directory: this.path
		}).then((res) => {
			this.checkContent(cb);
		}).catch((err) => {
			cb(true);
		});
	}
}

module.exports = ManifestGetter;