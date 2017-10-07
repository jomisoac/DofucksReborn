class Follower {
  constructor(win) {
    this.window = win;
    this.enabled = false;
    this.isFollowing = false;
    this.destX = null;
    this.destY = null;
    this.window.dofus.connectionManager.on("CompassUpdatePartyMemberMessage", this.CompassUpdatePartyMemberMessage.bind(this));
		this.window.dofus.connectionManager.on("CompassResetMessage", this.stopFollowing.bind(this));
		this.window.dofus.connectionManager.on("PartyFollowStatusUpdateMessage", this.PartyFollowStatusUpdateMessage.bind(this));
  }

  stopFollowing() {
    this.isFollowing = false;
  }

  PartyFollowStatusUpdateMessage(e) {
    this.isFollowing = e.success;
    if (e.success) {
      this.goToNextMap();
    }
	}

	CompassUpdatePartyMemberMessage(e) {
    if (!this.enabled) {
      return;
    }
		var type = e.type;
		var memberId = e.memberId;
		var x = e.worldX;
		var y = e.worldY;

		this.destX = x;
		this.destY = y;
		if (!this.window.isoEngine.actorManager.userActor.moving && !this.window.isoEngine.actorManager.userActor.isLocked && this.isFollowing) {
			this.goToNextMap();
		}
	}

	goToNextMap() {
    if (!this.enabled || !this.isFollowing) {
      return;
    }
		var currentMap = this.window.Dofucks.Mover.getMapCoordinates();
		var nextMap = {
			x: this.destX.toString(),
			y: this.destY.toString()
		};
		var direction = this.window.Dofucks.Mover.getDirection(nextMap, currentMap);
		if (!direction) {
      return console.debug("[FOLLOWER] Destination map is the current map");
		}
		var cell = this.window.Dofucks.Mover.getClosestCellToChangeMap(direction);
		if (cell.cellId === null) {
			return false;
		}
    this.window.Dofucks.Mover.changeMap(direction, cell.cellId, () => {
      this.goToNextMap();
    })
  }
}

export default Follower;
