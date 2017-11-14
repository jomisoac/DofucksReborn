class CharacteristicsUpgrader {
  constructor(win) {
    this.window = win;
    this.availableUpgrades = ["vitality", "wisdom", "strength", "intelligence", "chance", "agility"];
    this.statIds = {
      strength: 10,
      vitality: 11,
      wisdom: 12,
      chance: 13,
      agility: 14,
      intelligence: 15
    }
    this.toUpgrade = null;
		this.window.dofus.connectionManager.on("GameFightEndMessage", this.GameFightEndMessage.bind(this));
  }

  GameFightEndMessage(e) {
    this.updatePoints();
  }

  getStatCost(statCosts, basePoints) {
    for (var i = 0, n = statCosts.length - 1; n >= 0; n--)
      if (basePoints >= statCosts[n][0]) return statCosts[n][1];
    return i
  }

  updatePoints() {
    if (!this.toUpgrade || this.availableUpgrades.indexOf(this.toUpgrade) === -1) return;
    var statsPointsStr = "statsPointsFor" + this.toUpgrade[0].toUpperCase() + this.toUpgrade.substr(1);
    var statCosts = this.window.gui.playerData.characterBreed[statsPointsStr];
    var sc = this.getStatCost(statCosts, this.window.gui.playerData.characters.mainCharacter.characteristics[this.toUpgrade].base);
    var sp = this.window.gui.playerData.characters.mainCharacter.characteristics.statsPoints;
    var statId = this.statIds[this.toUpgrade];
    var pointsSpent = ~~(sp / sc)*sc;
    if (sp > 0 && pointsSpent >= sc) {
      this.window.dofus.connectionManager.sendMessage('StatsUpgradeRequestMessage', {statId: statId, boostPoint: pointsSpent});
    }
  }
}

export default CharacteristicsUpgrader;
