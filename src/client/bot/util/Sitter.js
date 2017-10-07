var random = require("random-js")();

class Sitter {
  constructor(win) {
    this.window = win;
    this.lowLifePercentage = 50;
    this.activeTimeout = 0;
    this.regenRate = 10;
  }

  sitAndWait(callback) {
    if (!this.isLowLife()) {
      return callback();
    }
		console.debug("[SITTER] Sit due to low life (health < "+this.lowLifePercentage+"%)");
		setTimeout(() => {
      this.window.dofus.connectionManager.once("LifePointsRegenBeginMessage", (e) => {
        this.regenRate = e.regenRate;
        var timer = this.getRegenTimeToBeFullLife();
        this.activeTimeout = setTimeout(() => {
          console.debug("[SITTER] Full life !");
          this.activeTimeout = 0;
          callback();
        }, timer);
      });
			this.window.dofus.connectionManager.sendMessage("EmotePlayRequestMessage", {emoteId: 1});
		}, random.integer(1000, 3000));
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
