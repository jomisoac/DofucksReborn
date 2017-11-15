var electron, {app, BrowserWindow, Tray, autoUpdater, dialog, session, powerSaveBlocker} = require('electron');
if (require('./src/electron/sqrlwin')(app)) return;

app.commandLine.appendSwitch('disable-renderer-backgrounding');
powerSaveBlocker.start('prevent-app-suspension');

const appVersion = require('./package.json').version;
const os = require('os').platform();

var ManifestGetter = require('./src/electron/tasks/ManifestGetter');
var DownloadAssets = require('./src/electron/tasks/DownloadAssets');
var CheckAssets = require('./src/electron/tasks/CheckAssets');
var FileManipulator = require('./src/electron/tasks/FileManipulator');
var AssetMapGetter = require('./src/electron/tasks/AssetMapGetter');

var downloaded = false;

app.on('window-all-closed', function() {
	if (process.platform != 'darwin') {
		app.quit();
	}
});

app.on('ready', function() {
	require('./src/electron/Menu');

	let win = new BrowserWindow({
		width: 800,
		height: 350,
		frame: false,
		icon: __dirname + '/src/assets/dofucks.png'
	});

	function ready() {
		inform(win, "I think it's now ready", 100);
		setTimeout(() => {
			mainWindow = new BrowserWindow({
				width: 1800,
				height: 1000,
				title: 'Dofucks',
				icon: __dirname + '/src/assets/dofucks.png',
				webPreferences: {
					backgroundThrottling: false,
					//offscreen: true
				}
			});
			mainWindow.loadURL('file://' + __dirname + '/src/browser/index.html');
			mainWindow.webContents.setUserAgent("Mozilla/5.0 (Linux; Android 7.1.1; ONEPLUS A5000 Build/NMF26X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Crosswalk/15.44.384.13 Mobile Safari/537.36")
			//mainWindow.webContents.setFrameRate(5);
			//mainWindow.setMinimizable(false);
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

  function upd() {
    var updateFeed = '';

    if (process.env.NODE_ENV !== 'development') {
      updateFeed = os === 'darwin' ?
        'http://dofucks.com:1337/updates/latest' :
        'http://download.dofucks.com/win32';

    	autoUpdater.setFeedURL(updateFeed + '?v=' + appVersion);
    	autoUpdater.checkForUpdates();
    	autoUpdater.on('update-available', () => {
    		console.log('update available');
    	});
    	autoUpdater.on('update-not-available', () => {
    	});
    	autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
				downloaded = true;
    		const dialogOpts = {
    			type: 'info',
    			buttons: ['Restart', 'Later'],
    			title: 'Application Update',
    			message: process.platform === 'win32' ? releaseNotes : releaseName,
    			detail: 'A new version has been downloaded. Restart the application to apply the update.'
    		}

    		dialog.showMessageBox(dialogOpts, (response) => {
    			if (response === 0) autoUpdater.quitAndInstall()
    		})
    	});
    	autoUpdater.on('error', message => {
    	  console.error('There was a problem updating the application')
    	  console.error(message);
        //inform_err(win, message);
    	});
    }
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

	win.loadURL('file://' + __dirname + '/src/browser/load.html');
  //win.openDevTools();
	win.webContents.on('did-finish-load', (event, input) => {
		checkAssets();
    upd();
		setInterval(() => {
			if (downloaded) return;
			upd();
		}, 1000*60*10);
	})
});
