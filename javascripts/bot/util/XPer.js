var random = require("random-js")();

class XPer {
	constructor(win) {
		this.window = win;
		this.enabled = false;
		this.minLvl = 0;
		this.maxLvl = 30;
		this.lowLifePercentage = 50;
		this.fightCount = 0;
		this.amIInFightTimeout = 0;
		this.regenRate = 10;
		this.isAuthorized = false;
		this.window.dofus.connectionManager.on("GameFightStartingMessage", this.GameFightStartingMessage.bind(this));
	}

	enable() {
		//this.fightCount = 0;
	    this.enabled = true;
	    this.window.Dofucks.Farmer.processIfNotActivated();
	}

	disable() {
		this.enabled = false;
	}

	GameFightStartingMessage(e) {
		if (!this.enabled || !this.isAuthorized) {
			return false;
		}
		this.fightCount += 1;
	}

	restartXp() {
		console.debug("Restarting to XP");
		var xper = Xper();
		xper.locked = false;
		TimersJS.oneShot(random.integer(2000, 3500), function() {
			xper.xp();
		});
	}

  isPotentiallyBusy() {
    return this.window.isoEngine.actorManager.userActor.isLocked
    || this.window.Dofucks.isFull
    || this.window.isoEngine.actorManager.userActor.moving
    || !this.window.isoEngine.actorManager.userActor.isDisplayed
    || this.window.gui.playerData.isFighting;
  }

	xp() {
		if (!this.isAuthorized) {
			return false;
		}
		//console.debug("[XPER] xp()");
		//this.window.activeFight.recordActivity();
		if (!this.isPotentiallyBusy()) {
			return this.goCheckMobs();
		} else {
      console.debug("[XPER] potentially busy, not going to check for mobs");
      return true;
    }
	}

	goCheckMobs() {
		var i = this.window.isoEngine.mapRenderer.interactiveElements;
		var interactives = this.window.isoEngine._getAllInteractives();
		for (var l = 0; l < interactives.length; l++) {
			var npc = null;
			var mob = null;
			var interactive = null;
			var c = interactives[l];
			c.actorId ? c.data && c.data.npcId ? (npc = c) : (mob = c) : (interactive = c);
			if (mob && mob.actorId < 0) {
				var mobs = mob.data.staticInfos.underlings;
				var totalLevel = mob.data.staticInfos.mainCreatureLightInfos.staticInfos.level;
				for (var k = 0; k < mobs.length; k++) {
					totalLevel += mobs[k].staticInfos.level;
				}
				if (totalLevel >= this.minLvl && totalLevel <= this.maxLvl) {
          this.window.Dofucks.Mover.goToCell(mob._position, () => {}, false);
					//this.window.isoEngine.attackActor(mob.actorId);
					return true;
				}
			}
		}
		return false;
	}
}

export default XPer;
