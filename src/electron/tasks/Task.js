const {app} = require('electron');

class Task {
	constructor(win) {
		this.win = win;
		this.path = app.getPath('userData');
	}

	inform(text, pct) {
		this.win.webContents.send('loadingData', {
			"text": text,
			"pct": pct
		});
	}
}

module.exports = Task;