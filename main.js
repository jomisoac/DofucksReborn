var electron, {app, BrowserWindow, Tray} = require('electron');

var ManifestGetter = require('./javascripts/tasks/ManifestGetter');
var DownloadAssets = require('./javascripts/tasks/DownloadAssets');
var CheckAssets = require('./javascripts/tasks/CheckAssets');
var FileManipulator = require('./javascripts/tasks/FileManipulator');
var AssetMapGetter = require('./javascripts/tasks/AssetMapGetter');

app.on('window-all-closed', function() {
	if (process.platform != 'darwin') {
		app.quit();
	}
});

app.commandLine.appendSwitch("disable-renderer-backgrounding");
app.on('ready', function() {

	let win = new BrowserWindow({
		width: 800, 
		height: 600, 
		frame: false,
		icon: __dirname + '/public/img/dofucks.png'
	});

	function ready() {
		inform(win, "I think it's now ready", 100);
		setTimeout(() => {
			mainWindow = new BrowserWindow({width: 1800, height: 1000, icon: __dirname + '/public/img/dofucks.png'});
			mainWindow.loadURL('file://' + __dirname + '/public/index.html');
			mainWindow.openDevTools();
			mainWindow.on('closed', function() {
				mainWindow = null;
			});
			win.close();
		}, 1000);
	}

	function checkAssets() {
		var manifestGetter = new ManifestGetter(win);
		manifestGetter.do((err) => {
			if (err) {
				return inform_err(win, "We can't download the file. Do you have enough space on your hard drive ?");
			}
			var assetMapGetter = new AssetMapGetter(win);
			assetMapGetter.do((err) => {
				if (err) {
					return inform_err(win, "We can't download the file. Do you have enough space on your hard drive ?");
				}
				var assetsChecker = new CheckAssets(win, manifestGetter.assets, assetMapGetter.assets);
				assetsChecker.do(() => {
					var assetDownloader = new DownloadAssets(win, assetsChecker.toDownload, assetsChecker.assetsToDownload, assetsChecker.versions, manifestGetter.assets, assetMapGetter.assets);
					assetDownloader.do((err, hasDownloaded) => {
						if (err) {
							inform_err(win, "We can't download assets. Do you have enough space on your hard drive ?");
							return;
						}
						if (hasDownloaded) {
							var fileManipulator = new FileManipulator(win);
							fileManipulator.do((err) => {
								ready();
							});
						} else {
							ready();
						}
					});
				});

			})
		});
	}

	function inform(win, text, pct) {
		win.webContents.send('loadingData', {
			"text": text,
			"pct": pct
		});
	}

	function inform_err(win, text) {
		win.webContents.send('error', text);
	}

	const appIcon = new Tray(__dirname + '/public/img/dofucks.png')
	win.loadURL('file://' + __dirname + '/public/load.html');

	win.webContents.on('did-finish-load', (event, input) => {
		checkAssets();
	})
});