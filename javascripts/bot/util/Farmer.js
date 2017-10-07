var random = require("random-js")();

import Harvester from './Harvester';
import XPer from './XPer';

const Action = Object.freeze({
  HARVEST: 0,
  XP: 1,
});

class Farmer {
  constructor(win) {
    this.window = win;
    this.Harvester = new Harvester(win);
    this.XPer = new XPer(win);
    this.lastAction = Action.HARVEST;
		this.window.dofus.connectionManager.on("GameFightEndMessage", this.GameFightEndMessage.bind(this));
  }

	GameFightEndMessage(e) {
    if (!this.isActivated()) {
      console.debug("[FARMER] We are not using nor deleting nor sitting since XPer or Harvester are not enabled.");
      return;
    }
    this.window.dofus.connectionManager.once('CurrentMapMessage', (e) => {
      setTimeout(() => {
        this.window.Dofucks.Deleter.deleteThen(null, () => {
          this.window.Dofucks.Utils.ItemUser.useThen(null, () => {
            this.window.Dofucks.Sitter.sitAndWait(() => {
              this.window.Dofucks.Farmer.process();
            });
          });
        });
      }, random.integer(1000, 2000));
    });
	}

  isActivated() {
    return this.Harvester.enabled + this.XPer.enabled;
  }

  processIfNotActivated() {
    if (this.isActivated() == 1) {
      this.process();
    }
  }

  process() {
    if (this.window.Dofucks.isLocked) {
      console.debug("[FARMER] We are locked due to overload. Retrying in 15 seconds.");
      setTimeout(() => {
        this.process();
      }, 15000);
      return;
    }
    if (this.window.Dofucks.Sitter.activeTimeout) {
      console.debug("[FARMER] We locked due to regen.");
      return;
    }
    if (this.isActivated() && !this.doThings()) {
      this.window.Dofucks.Path.goToNextMap(() => {
        this.process();
      });
    }
  }

  doThings() {
    switch (this.lastAction) {
      case Action.HARVEST:
      return this.processBoth('harvest');
      case Action.XP:
      return this.processBoth('xp');
      default:
      return false;
    }
  }

  processBoth(first) {
    var p1 = first == "harvest" ? this.processHarvest() : this.processXP();
    var p2 = first == "harvest" && !p1 ? this.processXP() : (first == "xp" && !p1 ? this.processHarvest() : false);
    return p1 || p2;
  }

  processHarvest() {
    //console.debug("[FARMER] Processing HARVESTER");
    if (!this.Harvester.enabled) {
      return false;
    }
    this.Harvester.isAuthorized = true;
    var success = this.Harvester.harvest();
    if (success) {
      this.lastAction = Action.HARVEST;
    } else {
      this.Harvester.isAuthorized = false;
    }
    return success;
  }

  processXP() {
    //console.debug("[FARMER] Processing XPER");
    if (!this.XPer.enabled) {
      return false;
    }
    this.XPer.isAuthorized = true;
    var success = this.XPer.xp();
    if (success) {
      this.lastAction = Action.XP;
    } else {
      this.XPer.isAuthorized = false;
    }
    return success;
  }
}

export default Farmer;
