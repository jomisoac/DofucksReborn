var random = require("random-js")();

class Harvester {
  constructor(win) {
    this.window = win;
    this.Mover = win.Dofucks.Mover;
    this.enabled = false;
    this.currentElem = null;
    this.useSkills = [];
    this.isAuthorized = false;
		this.window.dofus.connectionManager.on("InteractiveUseEndedMessage", this.InteractiveUseEndedMessage.bind(this));
		this.window.dofus.connectionManager.on("InteractiveUsedMessage", this.InteractiveUsedMessage.bind(this));
		this.window.dofus.connectionManager.on("GameFightStartingMessage", this.GameFightStartingMessage.bind(this));
  }

  enable() {
    this.enabled = true;
    this.window.Dofucks.Farmer.processIfNotActivated();
  }

  disable() {
    this.enabled = false;
  }

  InteractiveUseEndedMessage(e) {
    if (!this.isAuthorized) {
      return;
    }
    setTimeout(() => {
      if (!this.isPotentiallyBusy()) {
        this.isAuthorized = false;
      }
      if (this.currentElem && e.elemId == this.currentElem.elementId) {
        //console.debug("[HARVESTER] Interactive end use");
        this.currentElem = null;
        this.window.Dofucks.Farmer.process();
      }
    }, 102);
  }

  GameFightStartingMessage(e) {
    if (!this.enabled || !this.isAuthorized) {
      return;
    }
  }

  waitToStopMovingBeforeGoingBackToHarvest() {
    console.debug("[HARVESTER] I need to stop moving before going elsewhere");
    if (this.window.isoEngine.actorManager.userActor.moving) {
      setTimeout(() => {
        this.waitToStopMovingBeforeGoingBackToHarvest();
      }, 300);
    } else {
      this.window.Dofucks.Farmer.process();
    }
  }

  InteractiveUsedMessage(e) {
    if (!this.enabled || !this.isAuthorized) {
      return;
    }
    if (this.currentElem && e.elemId == this.currentElem.elementId && this.window.isoEngine.actorManager.userActor.isLocked) {
      //console.debug("[HARVESTER] On l'a eu !");
    } else if (this.currentElem && !this.window.isoEngine.actorManager.userActor.isLocked) {
      //console.debug("[HARVESTER] On l'a pas eu !");
      this.currentElem = null;
      this.waitToStopMovingBeforeGoingBackToHarvest();
    }
  }

  isPotentiallyBusy() {
    return this.window.isoEngine.actorManager.userActor.isLocked
    || this.window.Dofucks.isFull
    || this.window.isoEngine.actorManager.userActor.moving
    || !this.window.isoEngine.actorManager.userActor.isDisplayed
    || this.window.gui.playerData.isFighting;
  }

  harvest() {
    this.window.utils.inactivityManager.recordActivity();
    if (!this.isAuthorized) {
      return false;
    }
		//console.debug("[HARVESTER] harvest()");
		//this.window.activeFight.recordActivity();
		if (!this.isPotentiallyBusy()) {
			return this.goCheckResources();
		} else {
      console.debug("[HARVESTER] potentially busy, not going to check for resources");
      return true;
    }
	}

  getNearestInteractiveElement(exclude) {
    var exclude = (typeof exclude !== 'undefined') ? exclude : [];
    var obj = null;
    var myPos = this.window.utils.atouin.getCellCoord(this.window.isoEngine.actorManager.getActor(this.window.isoEngine.actorManager.userId).position);
    var minDiff = null;
    var coords = this.Mover.getMapCoordinates();
    for (var id in this.window.isoEngine.mapRenderer.interactiveElements) {
      var interactive = this.window.isoEngine.mapRenderer.interactiveElements[id];
      if (exclude.indexOf(id) == -1 && interactive.enabledSkills.length > 0 && this.window.Dofucks.Utils.isResource(interactive)) {
        var identifiedElement = this.window.isoEngine.mapRenderer.identifiedElements[interactive.elementId];
        if (identifiedElement) {
          var pos = this.window.utils.atouin.getCellCoord(identifiedElement.position);
          var elemSkill = interactive.enabledSkills[0];
          if (pos && myPos && this.isValidSkillId(elemSkill.skillId) && !this.isSomethingWeDontCareAbout(interactive.elementTypeId)) {
            var diff = Math.abs(myPos.x - pos.x) + Math.abs(myPos.y - pos.y);
            if (diff < minDiff || minDiff === null) {
              minDiff = diff;
              obj = interactive;
            }
          }
        }
      }
    }
    return obj;
  };

	goCheckResources() {
    var elem = this.getNearestInteractiveElement();
    if (!elem) {
      return false;
    }
    this.currentElem = elem;
    var cellId = this.window.isoEngine.mapRenderer.identifiedElements[elem.elementId]._position;
		var elemSkill = elem.enabledSkills[0];
		if (elem.enabledSkills.length > 0) {
			// tell we want to go to the resource
			this.Mover.goToCell(cellId, (i, n) => {
        if (this.currentElem) {
          this.window.dofus.sendMessage('InteractiveUseRequestMessage', { elemId: elem.elementId, skillInstanceUid: elem.enabledSkills[0].skillInstanceUid });
        }
  		}, true);
		}
		return elem.enabledSkills.length > 0;
	}

	isValidSkillId(e) {
    return this.useSkills.indexOf(parseInt(e)) != -1;
		/*switch (e) {
			case 183:
			case 200:
			case 212:
			case 213:
				return false;
			default:
		}*/
	}

	isSomethingWeDontCareAbout(e) {
		switch (e) {
			case 84:
				return true;
			default:
				return false;
		}
	}
}

export default Harvester;
