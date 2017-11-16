var random = require("random-js")();

class Mover {
  constructor(win) {
    this.window = win;
    this.direction = {
  		top: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27],
  		right: [27, 55, 83, 111, 139, 167, 195, 223, 251, 279, 307, 335, 363, 391, 419, 447, 475, 503, 531, 559, 41, 69, 97, 125, 153, 181, 209, 237, 265, 293, 321, 349, 377, 405, 433, 461, 489, 517, 545],
  		bottom: [545, 546, 547, 548, 549, 550, 551, 552, 553, 554, 555, 556, 557, 558, 559, 533, 534, 535, 536, 537, 538, 539, 540, 541, 542, 543, 544],
  		left: [0, 28, 56, 84, 112, 140, 168, 196, 224, 252, 280, 308, 336, 364, 392, 420, 448, 476, 504, 532, 14, 42, 70, 98, 126, 154, 182, 210, 238, 266, 294, 322, 350, 378, 406, 434, 462, 490, 518]
  	};
    this.aggressives = [
      54,64,65,68,72,74,75,76,82,87,88,89,90,91,93,94,95,96,97,99,102,107,108,110,111,113,123,124,127,155,157,170,171,173,178,179,180,181,182,
  	  211,212,213,214,216,226,228,229,230,231,232,233,249,252,253,255,257,261,263,289,290,291,292,296,372,378,379,380,396,423,442,446,447,449,450,
  	  457,464,465,466,475,478,479,481,488,525,527,528,529,535,536,537,568,583,584,585,586,587,588,589,590,594,595,596,597,598,600,601,603,612,651,744,
  	  746,747,748,749,751,752,753,754,755,756,758,759,760,761,762,763,780,783,784,785,786,789,790,792,827,876,891,932,935,936,937,938,939,940,941,
  	  942,943,1015,1018,1029,1048,1049,1050,1051,1052,1053,1054,1055,1056,1057,1071,1072,1073,1074,1075,1077,1080,1082,1084,1085,1086,1087,1108,
  	  1153,1154,1155,1156,1157,1158,1159
    ];

    this.indoorSprites = [18030, 21000];
  }

  getDirection(next, current) {
		var x = next.x - current.x;
		var y = next.y - current.y;
		return x != 0 ? (x<0?"left":"right") : (y != 0 ? (y<0?"top":"bottom") : false);
	}

  parsePosition(position) {
    if (!position) {
      return alert("Please select a path file before trying to XP or Harvest.");
    }
		if (position.indexOf(',') === -1 || position.length < 3) {
			return console.error("Wrong position: "+ position), false;
		}
		var split = position.split(',');
		var x = split[0];
		var y = split[1];
		return {x: x, y: y};
	}

  getMapCoordinates() {
		var posx = this.window.gui.playerData.position.mapPosition.posX;
    var posy = this.window.gui.playerData.position.mapPosition.posY;
		return posx !== undefined ? {x: posx, y: posy} : {x: 0, y: 0};
	}

  isCellFree(cellId) {
		var occupiedCells = this.window.isoEngine.actorManager.occupiedCells;
    return !occupiedCells[cellId];
	}

	isMobOnCell(cellId) {
		var occupiedCells = this.window.isoEngine.actorManager.occupiedCells;
    if (occupiedCells[cellId]) {
      for (var j = 0; j < occupiedCells[cellId].length; j++) {
        if (occupiedCells[cellId][j].actorId < 0) {
          return true;
        }
      }
    }
    return false;
	}

  getClosestCellToChangeMap(direction) {
		var occupiedCells = this.window.isoEngine.actorManager.occupiedCells;
		var currentCellId = this.window.isoEngine.actorManager.userActor.cellId;
		var canMoveDiagonally = this.window.isoEngine.actorManager.userActor.canMoveDiagonally;
		var finalPath = null;
		var finalCellId = null;
		for (var i = 0; i < this.direction[direction].length; i++) {
			var cellId = this.direction[direction][i];
			if (!this.window.isoEngine.mapRenderer.getChangeMapFlags(cellId)[direction]) {
				continue;
			}
			if (this.isMobOnCell(cellId)) {
				console.debug("Not moving on "+cellId+": there's a mob.");
				continue;
			}
			var path = this.window.utils.pathFinder.getPath(currentCellId, cellId, occupiedCells, canMoveDiagonally, false);
			if (path[path.length - 1] == cellId && (!finalPath || (path.length < finalPath.length && path.length > 1))) {
				finalPath = path;
				finalCellId = finalPath[finalPath.length - 1];
			}
		}
		if (!finalPath) {
			console.debug("No path to closest cell in direction: "+direction);
			return this.getClosestCellInRandomDirectionToChangeMap();
		}
		return {cellId: finalCellId, direction: direction};
	}

	getClosestCellInRandomDirectionToChangeMap() {
		var directions = Object.keys(this.direction);
		var direction = directions[random.integer(0, 3)];
		var cell;
		var tries = 4;
		do {
			tries -= 1;
			cell = this.getClosestCellToChangeMap(direction);
		} while (cell.cellId === null && tries > 0);
		return cell;
	}

  moveToNearestFreeWalkableCell(cb) {
		var cellId = this.window.isoEngine.actorManager.userActor.cellId;
    var nc = this.window.utils.mapPoint.getNeighbourCells(cellId, true).filter((e) => {
      return this.isCellFree(e) && this.window.isoEngine.mapRenderer.isWalkable(e)
    });
    this.goToCell(nc[random.integer(0, nc.length-1)], cb);
  }

  waitMapLoadThen(callback, wait) {
    if (wait === undefined) {
      this.window.isoEngine.once('mapLoaded', () => {
        //console.debug("[MOVER] mapLoaded");
        setTimeout(() => {
          this.waitMapLoadThen(callback, true);
        }, 200);
      });
      return;
    }
    if (this.window.foreground.locked || this.window.foreground.lockMap.loadMap) {
      setTimeout(() => {
        //console.debug("[MOVER] not rdy");
        this.waitMapLoadThen(callback, true);
      }, 500);
    } else {
      this.isChangingMap = false;
      //console.debug("[MOVER] callback");
      callback();
    }
  }

  changeMap(direction, cellId, callback) {
    var occupiedCells = this.getOccupiedCellsNotToBeAgressed();
		this.window.isoEngine._movePlayerOnMap(cellId, false, (i, n) => {
			if (!i && n == cellId) {
        this.isChangingMap = true;
				this.window.isoEngine._requestMapChange(this.window.isoEngine.mapRenderer.map[direction + "NeighbourId"], cellId);
        //this.window.dofucks.isChangingMap = true;
        if (callback) {
          this.waitMapLoadThen(callback);
        }
			} else {
				console.error("cannot go to "+cellId+" ("+n+")", i);
			}
		}, occupiedCells);
    setTimeout(() => {
      if (this.isChangingMap) {
        this.window.isoEngine._loadMapAssets();
      }
    }, 10000);
  }

  getIndoorCells() {
    var finalCells = [];
    var cells = this.window.isoEngine.mapRenderer.map.midgroundLayer;
    for (var cellId in cells) {
      var cellSprites = cells[cellId];
      for (var k = 0; k < cellSprites.length; k++) {
        var sprite = cellSprites[k];
        if (this.indoorSprites.indexOf(sprite.g) != -1) {
          finalCells.push(parseInt(cellId));
        }
      }
    }
    return finalCells;
  }

  /*goToCell(cellId, callback, stopBefore) {
    var occupiedCells = this.getOccupiedCellsNotToBeAgressed();
		this.window.isoEngine._movePlayerOnMapWithoutAggression(cellId, stopBefore, (i, n) => {
      if (callback) {
        callback(i, n);
      }
		}, occupiedCells);
  }*/

  goToCell(cellId, callback, stopBefore) {
    stopBefore = !!stopBefore;
    if("function" == typeof callback || (callback = function(){}));
    //var occupiedCells = this.getOccupiedCells();
		this.window.isoEngine._movePlayerOnMap(cellId, stopBefore, (i, n) => {
      if (callback) {
        callback(i, n);
      }
		});
  }

  getCellsNotToBeAggressed(cellId) {
  		return this.window.utils.mapPoint.getNeighbourCells(cellId, true);
	}

  getOccupiedCellsNotToBeAgressed() {
		var cellIds = [];
		var occupiedCells = [];
		var i = this.window.isoEngine.mapRenderer.interactiveElements;
		var interactives = this.window.isoEngine._getAllInteractives();
		for (var l = 0; l < interactives.length; l++) {
			var aggressive = false;
			var npc = null;
			var mob = null;
			var interactive = null;
			var c = interactives[l];
			//c.actorId ? c.data && c.data.npcId ? (npc = c) : (mob = c) : (interactive = c);
			c.actorId ? c.data.npcId ? (npc = c) : (mob = c) : (interactive = c);
			if (mob && mob.actorId < 0) {
				aggressive = this.aggressives.indexOf(mob.data.staticInfos.mainCreatureLightInfos.creatureGenericId) != -1;
				var mobs = mob.data.staticInfos.underlings;
				for (var k = 0; k < mobs.length; k++) {
					if (this.aggressives.indexOf(mobs[k].creatureGenericId) != -1) {
						aggressive = true;
					}
				}
			}
			if (aggressive) {
				cellIds.push(mob.cellId);
			}
		}
		for (var r = 0; r < cellIds.length; r++) {
			var cells = this.getCellsNotToBeAggressed(cellIds[r]);
			for (var m = 0; m < cells.length; m++) {
				if (cells[m] > 0) {
					occupiedCells.push(cells[m]);
				}
			}
		}
		var tmp = occupiedCells.slice(0);
		for (var i = 0; i < tmp.length; i++) {
			var cells = this.getCellsNotToBeAggressed(tmp[i]);
			for (var m = 0; m < cells.length; m++) {
				if (cells[m] > 0) {
					occupiedCells.push(cells[m]);
				}
			}
		}
		occupiedCells.filter( function( item, index, inputArray ) {
			return inputArray.indexOf(item) == index;
		});
		var realOccupied = this.window.isoEngine.actorManager.occupiedCells;
		for (var i = 0; i < occupiedCells.length; i++) {
			if (realOccupied[occupiedCells[i]]) {
				realOccupied[occupiedCells[i]].push({id:0});
			} else {
				realOccupied[occupiedCells[i]] = [{id:0}];
			}
		}
		return realOccupied;
	}
}

export default Mover;
