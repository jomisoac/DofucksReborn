var random = require("random-js")();

class Sitter {
  constructor(win) {
    this.window = win;
    this.lowLifePercentage = 50;
    this.activeTimeout = 0;
    this.activeInterval = 0;
    this.regenRate = 10;
  }

  sitAndWait(callback) {
    if (!this.isLowLife()) {
      return callback();
    }
    this.callback = callback;
		console.debug("[SITTER] Sit due to low life (health < "+this.lowLifePercentage+"%)");
		setTimeout(() => {
      this.window.dofus.connectionManager.once("LifePointsRegenBeginMessage", (e) => {
        this.regenRate = e.regenRate;
        var timer = this.getRegenTimeToBeFullLife();
        if (!this.activeTimeout) {
          this.activeTimeout = setTimeout(this.onFullLife.bind(this), timer);
        }
        if (!this.activeInterval) {
          this.activeInterval = setInterval(this.pingNoAfkPopup.bind(this), 60000);
        }
      });
			this.window.dofus.connectionManager.sendMessage("EmotePlayRequestMessage", {emoteId: 1});
		}, random.integer(1000, 3000));
	}

  pingNoAfkPopup() {
    console.debug("[SITTER] No AFK popup while sitting.");
    this.window.utils.inactivityManager.recordActivity();
  }

  onFullLife() {
    console.debug("[SITTER] Full life !");
    clearInterval(this.activeInterval);
    this.activeTimeout = 0;
    this.activeInterval = 0;
    if (this.callback) {
      this.callback();
    }
    this.callback = null;
  }

	getRegenTimeToBeFullLife() {
		var regenRate = this.regenRate*100;
		var lp = this.window.gui.playerData.characters.mainCharacter.characteristics.lifePoints;
		var mlp = this.window.gui.playerData.characters.mainCharacter.characteristics.maxLifePoints;
		var dif = mlp - lp;
		return regenRate*dif;
	}

	isLowLife() {
		var lp = this.window.gui.playerData.characters.mainCharacter.characteristics.lifePoints;
		var mlp = this.window.gui.playerData.characters.mainCharacter.characteristics.maxLifePoints;
		var pct = lp * 100 / mlp;
		if (pct < this.lowLifePercentage) {
			return true;
		}
		return false;
	}
}

export default Sitter;
