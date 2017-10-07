class Task {
	constructor(win) {
		this.win = win;
	}

	inform(text, pct) {
		this.win.webContents.send('loadingData', {
			"text": text,
			"pct": pct
		});
	}
}

module.exports = Task;