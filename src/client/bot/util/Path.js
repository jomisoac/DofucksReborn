class Path {
    constructor(win) {
      this.window = win;
      this.Mover = this.window.Dofucks.Mover;
      this.pathIndex = 0;
      this.path = [];
      this.strict = true;
      this.isLost = true;
    }

    setPath(path) {
      this.path = path;
      this.pathIndex = 0;
      this.isLost = true;
    }

    /**
    *** Get path index. Used to retrieve the path if lost and in strict mode.
    **/

  	getPathIndex() {
  		var coordinates = this.Mover.getMapCoordinates();
  		var i;
  		for (i = 0; i < this.path.length; i++) {
        var pos = this.Mover.parsePosition(this.path[i]);
  			if (coordinates.x == pos.x && coordinates.y == pos.y) {
  				return i;
  			}
  		}
  		this.isLost = true;
  		return -1;
  	}

    /**
    *** Get next path index. It tracks the path index where the character is
    *** and returns the next coordinates, or the first if none.
    *** It also remove duplicates maps in the path.
    **/

  	getNextPathIndex() {
  		var coordinates = this.Mover.getMapCoordinates();
  		var index = this.getPathIndex();
  		var c;
  		do {
  			index = index + 1 < this.path.length ? index + 1 : 0;
  			c = this.path[index];
        var pos = this.Mover.parsePosition(c);
  		} while (pos.x == coordinates.x && pos.y == coordinates.y);
  		return index;
  	}

    /**
    *** It should return the next direction for the current path
    **/

    getNextDirection() {
  		if (this.isLost) {
  			var ind = this.getPathIndex();
  			if (ind == -1) {
  				this.pathIndex = 0;
  			} else {
  				this.pathIndex = ind + 1;
  				this.isLost = false;
  			}
  		} else {
  			this.pathIndex = this.getNextPathIndex();
  		}
  		this.pathIndex = this.pathIndex >= this.path.length ? 0 : this.pathIndex;

      var currentMap = this.Mover.getMapCoordinates();
  		var nextMap = this.Mover.parsePosition(this.path[this.pathIndex]);

  		return this.Mover.getDirection(nextMap, currentMap);
    }

    goToNextMap(callback) {
      var direction = this.getNextDirection();
      var cell = this.Mover.getClosestCellToChangeMap(direction);
      if (cell && (cell.cellId !== null && isFinite(cell.cellId))) {
        this.Mover.changeMap(direction, cell.cellId, callback);
      } else {
        // we're stuck ?
        console.error("Path.goToNextMap: impossible ?");
      }
    }
}

export default Path;
