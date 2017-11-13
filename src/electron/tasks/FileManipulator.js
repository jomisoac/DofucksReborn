const fs = require('fs');
const {publicDir} = require('../constants.js');
var Task = require('./Task');

class FileManipulator extends Task {
	constructor(win) {
		super(win);
		this.scriptContent = null;
		this.styleContent = null;
	}

	fixAssets() {
		this.scriptContent = this.scriptContent.replace(/cdvfile:\/\/localhost\/persistent\/data\/assets/g, 'assets');
		// script file is in /build, meaning that we need to access via ../ to assets
		this.styleContent = this.styleContent.replace(/cdvfile:\/\/localhost\/persistent\/data\/assets/g, '../assets');
	}

	removeAnalytics() {
		this.scriptContent = this.scriptContent.replace('window.Config.analytics', 'null');
	}

	enableConsole() {
		this.scriptContent = this.scriptContent.replace(/(overrideConsole.=.function\(\) {)([^])*(},._.logUncaughtExceptions)/g, '$1$3');
	}

	enableAdminMode() {
		this.scriptContent = this.scriptContent.replace(/([a-zA-Z]{1,2}\.prototype)\.isModeratorOrMore.[\S\s]*\1(.isModerator)/, "$1.isModeratorOrMore=function(){return true},$1$2");
	}

	displaySentMessages() {
		this.scriptContent = this.scriptContent.replace(/([a-zA-Z]{1,2})\.sendMessage=function\(([a-zA-Z]{1,2}),([a-zA-Z]{1,2})\){\1\.send\("sendMessage"/, '$1.sendMessage=function($2,$3){top.console.log($2,$3);$1.send("sendMessage"');
	}

	disableAppBackground() {
		this.scriptContent = this.scriptContent.replace(/,this.setupAppTransition\(\)/, '');
		//this.scriptContent = this.scriptContent.replace(/([a-zA-Z]{1,2})\.emit\("appLeaveBackground"\)/, 'void(0)');
	}

	enableAccessToAllFunctions() {
		this.scriptContent = this.scriptContent.replace(/(return ([a-zA-Z]{1,2})\.([a-zA-Z]{1,2})=([a-zA-Z]{1,2}),\2\.([a-zA-Z]{1,2})=([a-zA-Z]{1,2}),\2\.([a-zA-Z]{1,2})="",\2\(0\))/, 'window.master=$2;$1')
	}

	disableLogger() {
		this.scriptContent = this.scriptContent.replace(/(, window\.fetch\(.+\/logger)/, '; return null $1');
	}

	disableChangeMapAnimations() {
		// rewrite loading transitions
		this.scriptContent = this.scriptContent.replace(/([a-zA-Z]{1,2}\.prototype)\._runLoadingFadeInTransition.[\S\s]*\1(._runLoadingFadeOutTransition)/, "$1._runLoadingFadeInTransition=function(){this._loadingFadeInTransitionRunning=!0,this._waitingForMessage=!0,this.showLoadingProgress(0);this.mapScene.renderingParams.ratio=0;var e=this;e._saveImageForTransition(\"current\"),e._loadingFadeInTransitionRunning=!1,e._startLoading();},$1$2");
		this.scriptContent = this.scriptContent.replace(/([a-zA-Z]{1,2}\.prototype)\._runLoadingFadeOutTransition.[\S\s]*\1(.makeActorWalkIn)/, "$1._runLoadingFadeOutTransition=function(){var e = this,t = this.mapScene;null !== e._mapSceneTransitionGraphic && (e._mapSceneTransitionGraphic.remove(), e._mapSceneTransitionGraphic = null);t.setShader(\"unfiltering\"), t.renderingParams.ratio = .15, e._hideLoadingProgress();},$1$2");
	}

	createUtils() {
		// getLine to test LoS
		this.scriptContent = this.scriptContent.replace(/(getLine=)/, "$1window.utils.getLine=");
		// getReachableZone for fighter
		this.scriptContent = this.scriptContent.replace(/(getReachableZone=)/, "$1window.utils.getReachableZone=");
		// spellShapes
		this.scriptContent = this.scriptContent.replace(/(getSpellEffectZone=function(.*?))(\},function)/, "$1;window.utils.spellShapes=e.exports;$3");
		// losDetector
		this.scriptContent = this.scriptContent.replace(/(([a-zA-Z]{1}).exports.getCellDistance=[a-zA-Z]{1},[a-zA-Z]{1}.exports.getDistance=[a-zA-Z]{1})/, "$1;window.utils.losDetector=$2.exports;");
		// mapPoint
		this.scriptContent = this.scriptContent.replace(/(([a-zA-Z]{1}).getOrientation=[a-zA-Z]{1},[a-zA-Z]{1}.getDistance=[a-zA-Z]{1})/, "$1;window.utils.mapPoint=$2;");
		// atouin
		this.scriptContent = this.scriptContent.replace(/(([a-zA-Z]{1}).exports.cellCoord=[a-zA-Z]{1}\(\))/, "$1;window.utils.atouin=$2.exports;");
		// pathFinder
		this.scriptContent = this.scriptContent.replace(/(([a-zA-Z]{1}).logPath=function(.*?))(\},function)/, "$1;window.utils.pathFinder=$2;$4");
		// inactivityManager
		this.scriptContent = this.scriptContent.replace(/([a-zA-Z]{1}.prototype._leaveInactiveMode=function(.*?))(\},function)/, "$1;window.utils.inactivityManager=e.exports;$3");

	}

	do(cb) {
		this.inform("Now regexping....", 80);
		try {
			this.scriptContent = fs.readFileSync(this.path+'/build/script.js').toString();
			this.styleContent = fs.readFileSync(this.path+'/build/styles-native.css', 'utf8');
			this.enableAdminMode();
			this.fixAssets();
			this.removeAnalytics();
			this.enableConsole();
			this.enableAccessToAllFunctions();
			this.disableAppBackground();
			this.displaySentMessages();
			this.disableLogger();
			this.disableChangeMapAnimations();
			this.createUtils();
			fs.writeFileSync(this.path+'/build/script.js', this.scriptContent);
			fs.writeFileSync(this.path+'/build/styles-native.css', this.styleContent);
			cb(false);
		} catch (e) {
			console.error(e);
			cb(true);
		}
    //replace(/(logUncaughtExceptions.=.function\(.*\).{)([^])*(},.*\.exports.*=.*_\n},.*function\(e,.*t,.*i\))/g, '$1$3')
    //replace(/(var.*=.*\.touches\s\|\|.*\[\],)/g, 'if (e.type === "mousedown" || e.type === "mouseup") {return o.x = e.clientX, o.y = e.clientY, { x: o.x, y: o.y, touchCount: "mouseup" === e.type ? 0 : 1, touches: [{x: o.x, y: o.y }] } }\n$1')
	}

}

module.exports = FileManipulator;
