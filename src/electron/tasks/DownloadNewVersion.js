const fs = require('fs');
const {download} = require('electron-dl');
const {appUrl} = require('../constants.js');
var Task = require('./Task');
const spawn = require('child_process').spawn

class DownloadNewVersion extends Task {

	constructor(win, newVer) {
		super(win);
		this.newVer = newVer;
	}

	do(cb) {
		this.inform("Downloading new version...", 1);
		download(this.win, appUrl, {
			filename: 'update.asar',
			directory: __dirname+"/../../../..",
			onProgress: (p) => {
				this.inform("Downloading new version...", p*100);
			},
			openFolderWhenDone: true
		}).then((res) => {
			fs.writeFileSync(this.path+'/patch', this.newVer);
			cb(false);
			/*fs.unlinkSync(__dirname+"/../../../../app.asar");
			fs.renameSync(__dirname+"/../../../../update.asar", __dirname+"/../../../../app.asar")*/
		}).catch((err) => {
			cb(err);
		});
	}
}

module.exports = DownloadNewVersion;