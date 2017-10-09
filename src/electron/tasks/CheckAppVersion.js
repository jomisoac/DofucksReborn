const fs = require('fs');
const {download} = require('electron-dl');
const {patchUrl} = require('../constants.js');
var Task = require('./Task');

class CheckAppVersion extends Task {

	constructor(win) {
		super(win);
		this.version;
		this.remoteVersion;
	}

	do(cb) {
		this.inform("Checking for updates...", 1);
		download(this.win, patchUrl, {
			filename: 'patch_remote',
			directory: this.path
		}).then((res) => {
			this.remoteVersion = fs.readFileSync(this.path+'/patch_remote');
			try {
				this.version = fs.readFileSync(this.path+'/patch');
			} catch (e) {
				this.version = 0;
			}
			cb(false);
		}).catch((err) => {
			cb(true);
		});
	}
}

module.exports = CheckAppVersion;