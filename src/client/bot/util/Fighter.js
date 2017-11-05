var random = require("random-js")();

class Fighter {
  constructor(win) {
    this.window = win;
    this.spells = [];
  	this.spellsToUse = [];
  	this.spellsUsable = {};
    this.enabled = false;

    this.finishTurnMin = 300;
    this.finishTurnMax = 600;
    this.castSpellMin = 1500;
    this.castSpellMax = 3000;
    this.actionMin = 1000;
    this.actionMax = 2000;

  	this.teamId;
  	this.turn = 0;
  	this.ourTurn = false;
  	this.berserker = false;
    this.skipTurn = false;

  	this.allyRatio = 7;
  	this.boostRatio = 5;
  	this.summonRatio = 5;
  	this.killRatio = 3;

  	this.waterEffects = [85, 91, 96, 123, 152, 275, 426, 1014, 1065, 1068, 1095, 1121, 1127, 1132, 1137];
  	this.earthEffects = [86, 92, 97, 118, 157, 276, 422, 1122, 1128, 1140];
  	this.airEffects = [87, 93, 98, 119, 277, 428, 1013, 1064, 1067, 1093, 1119, 1125, 1131, 1136];
  	this.fireEffects = [88, 94, 99, 108, 126, 155, 278, 424, 1015, 1037, 1066, 1069, 1094, 1120, 1126, 1133, 1138];
  	this.neutralEffects = [82, 89, 95, 100, 143, 144, 279, 430, 670, 671, 672, 1012, 1071, 1092, 1109, 1118, 1124, 1134, 1139];

  	this.boostEffects = [
      110,111,112,114,115,117,118,119,120,121,123,124,125,126,128,136,137,138,142,158,160,
      161,752,753,165,174,176,178,182,183,184,776,788,210,211,212,213,214,240,241,242,243,
      244,250,251,252,253,254,260,261,262,263,264,1039,1040,281,282,283,284,285,286,287,
      288,289,290,291,292,293,1054
    ];
	this.window.dofus.connectionManager.on("GameFightStartingMessage", this.GameFightStartingMessage.bind(this));
    this.window.dofus.connectionManager.on("GameFightEndMessage", this.GameFightEndMessage.bind(this));
    this.window.dofus.connectionManager.on("GameFightPlacementPossiblePositionsMessage", this.GameFightPlacementPossiblePositionsMessage.bind(this));
    this.window.dofus.connectionManager.on("GameEntitiesDispositionMessage", this.GameEntitiesDispositionMessage.bind(this));
    this.window.dofus.connectionManager.on("GameFightTurnStartMessage", this.GameFightTurnStartMessage.bind(this));
    this.window.dofus.connectionManager.on("GameActionFightNoSpellCastMessage", this.GameActionFightNoSpellCastMessage.bind(this));
    this.window.dofus.connectionManager.on("GameFightNewRoundMessage", this.GameFightNewRoundMessage.bind(this));
  }

  GameFightStartingMessage(e) {
    if (!this.enabled) {
      return;
    }
    console.debug("[FIGHT] Starting");
	}

  GameFightEndMessage(e) {
    if (!this.enabled) {
      return;
    }
    console.debug("[FIGHT] Stopping");
  }

	GameFightPlacementPossiblePositionsMessage(e) {
    if (!this.enabled) {
      return;
    }
		this.teamId = e.teamNumber;

		var currenctCellId = this.window.isoEngine.actorManager.userActor.cellId;
		var currentDistance = false;
		var finalCellId = -1;
		var positions;
		if (this.teamId == 0) {
			positions = e.positionsForChallengers;
		} else {
			positions = e.positionsForDefenders;
		}
		setTimeout(() => {
			var enemies = this.getAliveEnemies();
			for (var i = 0; i < enemies.length; i++) {
				var enemy = enemies[i];
				var cellId = enemy.data.disposition.cellId;
				for (var j = 0; j < positions.length; j++) {
					var cellPos = positions[j];
					// distance without pathfinder
					var distance = this.window.utils.losDetector.getCellDistance(cellPos, cellId);
					if (finalCellId == -1 || (this.berserker ? (distance > 1 && distance < currentDistance) : (distance > currentDistance))) {
						finalCellId = cellPos;
						currentDistance = distance;
					}
				}
			}
			if (finalCellId != -1) {
				setTimeout(() => {
					this.window.dofus.sendMessage("GameFightPlacementPositionRequestMessage", {cellId: finalCellId});
					setTimeout(() => {
						this.window.dofus.sendMessage("GameFightReadyMessage", {isReady: true});
					}, random.integer(500, 1500));
				}, random.integer(500, 2000));
			}
		}, random.integer(1000, 2000));
	}

	GameFightNewRoundMessage(e) {
		this.turn = e.roundNumber;
	}

	GameFightTurnStartMessage(e) {
    if (!this.enabled) {
      return;
    }
		var id = e.id;
		this.refreshSpellData();
		if (this.window.gui.playerData.id == id) {
			// our turn
			this.ourTurn = true;
      if (this.skipTurn) {
        this.finishMyTurn();
      } else {
        this.anotherAction();
      }
			//Notifier().notifyMe('turnStarts', "It's your turn to play", "You get "+(e.waitTime/1000)+" seconds to play");
		} else {
			this.ourTurn = false;
		}
	}

	// called when somebody moves before the fight starts
	GameEntitiesDispositionMessage(e) {
    if (!this.enabled) {
      return;
    }
		/*
		e.dispositions[].cellId; // on what cell the player moved
		e.dispositions[].id; // player id
		*/
	}

	GameActionFightNoSpellCastMessage(e) {
    if (!this.enabled) {
      return;
    }
		if (this.ourTurn) {
			this.finishMyTurn();
		}
	}


	refreshSpellData() {
		var spellData = this.window.gui.playerData.characters.mainCharacter.spellData;
		var spellsStatus = spellData._spellsStatus;
		for (var index in spellData.spells) {
			if (spellsStatus[index] == 2) {
				this.spells.push(spellData.spells[index]);
			}
		}
		this.refreshUsableSpells();
	}

	refreshUsableSpells() {
		this.spellsUsable = {};
		for (var j = 0; j < this.spellsToUse.length; j++) {
			var spellToUseId = this.spellsToUse[j];
			for (var i = 0; i < this.spells.length; i++) {
				var spell = this.spells[i];
				if (spell.id == spellToUseId) {
					this.spellsUsable[spellToUseId+"_"] = spell;
				}
			}
		}
	}

	// returns an array of cells that are in the effect zone of the spell
	// fromCellId : the cellId from where the spell would be casted
	// toCellId : the cellId of the impact
	getSpellEffectZone(spell, fromCellId, toCellId) {
		var zone = this.window.utils.spellShapes.getSpellEffectZone(this.window.isoEngine.mapRenderer.map.cells, fromCellId, toCellId, spell.getZoneEffect(), this.window);
		var cells = [];
		for (var cell in zone) {
			cells.push(parseInt(cell));
		}
		return cells;
	}

	// returns fighters in zone (array) from team teamId
	getFightersFromTeamInZone(zone, teamId) {
		var fighters = this.window.gui.fightManager.getAvailableFighters();
		var retFighters = [];
		for (var index in fighters) {
			var fighter = fighters[index];
			if (zone.indexOf(fighter.data.disposition.cellId) != -1 && fighter.data.teamId == teamId && fighter.data.alive && fighter.data.stats.lifePoints > 0) {
				retFighters.push(fighter);
			}
		}
		return retFighters;
	}

	getAlliesInZone(zone) {
		return this.getFightersFromTeamInZone(zone, this.teamId == 0 ? 0 : 1);
	}

	getEnemiesInZone(zone) {
		return this.getFightersFromTeamInZone(zone, this.teamId == 0 ? 1 : 0);
	}

	testLos(mapCells, a, cellId, visibleActors) {
		var mp = this.window.utils.mapPoint.getMapPointFromCellId(cellId);
		var finalArray = [];
		for (var i = 0; i < a.length; i++) {
			var r = a[i];
			var u = this.window.utils.mapPoint.getMapPointFromCellId(r);
			var p = this.window.utils.getLine(mp.x, mp.y, u.x, u.y);
			var g = p.length;
			var m = false;
			for (var f = 0; f < g; f++) {
				var _ = this.window.utils.mapPoint.getCellIdFromMapPoint(p[f].x, p[f].y),
					v = mapCells[_];
				if (visibleActors[_] && f < g - 1 || 2 !== (2 & v.l)) {
					m = true;
					break
				}
			}
			if (!m) {
				finalArray.push(r);
			}
		}
		return finalArray;
	}

	// it tests the mapCells again the sight of view and returns an array of targettable cells
	getSpellSightOfViewAtCell(myCellId, spell) {
    var spellData = spell.spellLevel;
		if (this.window.isoEngine.mapRenderer.map && this.window.isoEngine.mapRenderer.map.cells && spellData) {
			var mapCells = this.window.isoEngine.mapRenderer.map.cells;
			var spellRange = this.window.utils.spellShapes.getSpellRange(mapCells, myCellId, spellData, spell);
			var visibleActors = this.window.actorManager.getIndexedVisibleActors();
			var a = [];
			var getCellIdFromMapPoint = this.window.utils.mapPoint.getCellIdFromMapPoint;
			var getMapPointFromCellId = this.window.utils.mapPoint.getMapPointFromCellId;
			for (var f = 0; f < spellRange.length; f++) {
				var cellId = getCellIdFromMapPoint(spellRange[f][0], spellRange[f][1]);
				if (void 0 !== cellId && a.indexOf(cellId) == -1) {
					if (spellData.needFreeCell && visibleActors[cellId]) {
						//a.push(cellId);
					} else {
						var _ = mapCells[cellId].l || 0;
						if (3 === (7 & _)) {
							a.push(cellId);
						}
					}
				}
			}
			if (spellData.castTestLos) {
				a = this.testLos(mapCells, a, myCellId, visibleActors);
			}
			return a;
		}
	}

	getAliveFromTeam(teamId) {
		var fighters = this.window.gui.fightManager.getAvailableFighters();
		var retFighters = [];
		for (var index in fighters) {
			var fighter = fighters[index];
			if (fighter.data.stats.lifePoints > 0 && fighter.data.alive && fighter.data.teamId == teamId) {
				retFighters.push(fighter);
			}
		}
		return retFighters;
	}

	// returns alive enemies
	getAliveEnemies() {
		return this.getAliveFromTeam(this.teamId == 0 ? 1 : 0);
	}

	// return alive allies
	getAliveAllies() {
		return this.getAliveFromTeam(this.teamId == 0 ? 0 : 1);
	}

	getClosestFighterOfCell(cellId, fighters) {
		var closest = null;
		var closestDistance = 999;
		for (var i = 0; i < fighters.length; i++) {
			var fighter = fighters[i];
			var fighterCellId = fighter.data.disposition.cellId;
			var distance = this.window.utils.losDetector.getCellDistance(cellId, fighterCellId);
			if (!closest || distance < closestDistance || (distance == closestDistance && fighter.data.stats.lifePoints < closest.data.stats.lifePoints)) {
				closest = fighter;
				closestDistance = distance;
			}
		}
		return closest;
	}

	getPathFromReachableZone(reachableZone, fromCellId, toCellId) {
		for (var a in reachableZone) {
			if (fromCellId == toCellId) {
				return [parseInt(toCellId)];
			}
			if (a == toCellId) {
				var arr = this.getPathFromReachableZone(reachableZone, fromCellId, reachableZone[a].from);
				arr.push(parseInt(toCellId));
				return arr;
			}
		}
		return [parseInt(fromCellId)];
	}

	move(path) {
		var compressedPath = this.window.utils.pathFinder.compressPath(path);
		this.window.dofus.sendMessage("GameMapMovementRequestMessage", {keyMovements: compressedPath, mapId: this.window.isoEngine.mapRenderer.mapId});
		this.anotherAction();
	}

	moveCloserTo(cellId, mp) {
		if (mp <= 1) {
			return false;
		}
		var stats = this.getFighterStats();
		mp = stats.movementPointsCurrent < mp ? stats.movementPointsCurrent : mp;
		var myCellId = this.window.isoEngine.actorManager.userActor.cellId;
		var occupiedCells = this.window.isoEngine.actorManager.occupiedCells;
		var path = this.window.utils.pathFinder.getPath(myCellId, cellId, occupiedCells, false, true);
		var path = path.slice(0, mp + 1);
		this.move(path);
		return true;
	}

	moveAway() {
		var highestDistance = 0;
		var highestDistanceCellId = 0;
		var me = this.window.isoEngine.actorManager.userActor;
		var myCellId = me.cellId;
		var reachableZone = this.window.utils.getReachableZone(me, myCellId);
		var enemies = this.getAliveEnemies();
		for (var a in reachableZone) {
			if (reachableZone[a].reachable) {
				if (reachableZone[a].ap > 0) {
					// requires ap
				} else {
					// we can walk on there;
					var enemy = this.getClosestFighterOfCell(a, enemies);
					var distance = this.window.utils.losDetector.getCellDistance(a, enemy.data.disposition.cellId);
					if (distance >= highestDistance) {
						highestDistance = distance;
						highestDistanceCellId = a;
					}
				}
			} else {
				// we can't walk here
			}
		}
		if (highestDistanceCellId == 0) {
			return false;
		}
		var occupiedCells = this.window.isoEngine.actorManager.occupiedCells;
		var stats = this.getFighterStats();
		var path = this.getPathFromReachableZone(reachableZone, myCellId, highestDistanceCellId);
		this.move(path);
		return true;
	}

	canCastSpell(spell, actor) {
		var me = this.window.gui.fightManager.getAvailableFighters()[this.window.gui.playerData.id];
		var spellData = me.spells[spell.spellId];
		//console.debug(spellData);
		if (!spellData) {
			//console.debug("On a pas encore lancé ce sort, on peut donc le lancer");
			return true;
		}
		var castData = spellData.castingData;
		//console.debug("SPELLDATA", spellData);

		if (this.turn-castData.lastCastTurn <= spell.minCastInterval) {
			//console.debug("On a lancé ce sort il y a "+(this.turn-castData.lastCastTurn)+" tours. Il en faut "+spell.minCastInterval);
			return false;
		}
		//console.debug("On a lancé ce sort "+castData.castThisTurn+"/"+spell.maxCastPerTurn+" fois ce tour");
		if (spell.maxCastPerTurn > 0 && castData.castThisTurn >= spell.maxCastPerTurn) {
			return false;
		}
    // todo : targetted must be a count for maxStack per turn?
		var targetted = castData.targetsThisTurn[actor.id];
		//console.debug(targetted);
		if (!targetted) {
			//console.debug("On a pas encore lancé le sort sur cette cible ("+(actor && actor.id ? actor.id : actor)+")");
			return true;
		}
		if (spell.maxStack > 0 && targetted >= spell.maxStack) {
      console.debug("Reached max stack on this turn : "+targetted+"/"+spell.maxStack);
			return false;
		}
		if (spell.maxCastPerTarget > 0 && targetted/*+1*/ >= spell.maxCastPerTarget) {
      console.debug("Reached max stack on target : "+(targetted/*+1*/)+"/"+spell.maxCastPerTarget);
			return false;
		}
		return true;
	}

	getActorOnCell(cellId) {
		var allies = this.getAliveAllies();
		var enemies = this.getAliveEnemies();
		for (var i = 0; i < allies.length; i++) {
			if (allies[i].data.disposition.cellId == cellId) {
				return allies[i];
			}
		}
		for (var i = 0; i < enemies.length; i++) {
			if (enemies[i].data.disposition.cellId == cellId) {
				return enemies[i];
			}
		}
		return cellId;
	}

	finishMyTurn() {
		setTimeout(() => {
			this.window.dofus.sendMessage("GameFightTurnFinishMessage");
		}, random.integer(this.finishTurnMin, this.finishTurnMax));
	}

	getFighterStats(fighter) {
		return this.window.gui.playerData.characters.getControlledCharacter().characteristics;
	}

	castSpell(spell, cellId, fromCellId) {
    /*var actors = [];
    var zone = this.getSpellEffectZone(spell, fromCellId, cellId);
    var allies = this.getAlliesInZone(zone);
    var enemies = this.getEnemiesInZone(zone);
    for (var i = 0; i < allies.length; ++i) {
      actors.push(allies[i].id);
    }
    for (var i = 0; i < enemies.length; ++i) {
      actors.push(enemies[i].id);
    }
    console.debug(actors);
    spell.cast(this.turn, actors, !!spell.maxCastPerTurn);*/
    // retrieve actors that are hurt when casting a spell, by calling spell.cast(turnNumber, [actors], useMaxCastPerTurn (boolean));
		this.window.gui.emit("checkServerLag", "fightAction", "start")
		this.window.dofus.sendMessage("GameActionFightCastRequestMessage", {spellId: spell.id, cellId: cellId});
		this.window.gui.fightManager.spellCastSucceeded(spell.id, this.window.gui.playerData.characters.controlledCharacterId)
		this.anotherAction();
	}

	closestAvailableCellFrom(spell, myCellId, closestCellId) {
		var occupiedCells = this.window.isoEngine.actorManager.occupiedCells;
		var cells = this.window.isoEngine.mapRenderer.map.cells;
		var targettable = this.getSpellSightOfViewAtCell(myCellId, spell);
		var finalDistance = 99;
		var finalCellId = false;
		for (var i = 0; i < targettable.length; i++) {
			var itsCellId = targettable[i];
			var distance = this.window.utils.losDetector.getCellDistance(itsCellId, closestCellId);
			if (distance < finalDistance && distance > 0) {
				finalDistance = distance;
				finalCellId = itsCellId;
			}
		}
		return finalCellId;
	}

	/*this.isSafeWalkableCell(reachableZone, fromCellId, toCellId) {
		var path = this.getPathFromReachableZone(reachableZone, fromCellId, toCellId);
		for (var i = 1; i < path.length; i++) {
			var cellId = path[i];
			if (!reachableZone[cellId].reachable || reachableZone[cellId].ap > 0) {
				return false;
			}
		}
		return true;
	}*/

	isDamageSpell(spell) {
		var spellLevel = spell.spellLevel;
		var spellLevelId = spell.getSpellLevelId();
		for (var i = 0; i < spell.getEffectsIds().length; i++) {
			var effect = spell.effectInstances[spellLevelId + "-effects-" + i];
			if (effect.isDamageEffect()) {
				return true;
			}
		}
		return false;
	}

	isBoostSpell(spell) {
		var spellLevel = spell.spellLevel;
		var spellLevelId = spell.getSpellLevelId();
    var isDamageSpell = false;
    var isBoost = false;
		for (var i = 0; i < spell.getEffectsIds().length; i++) {
			var effect = spell.effectInstances[spellLevelId + "-effects-" + i];
      if (effect.isDamageEffect()) {
        return false;
      }
			if (effect.effect.boost === true && -1 !== this.boostEffects.indexOf(effect.effect.id)) {
				isBoost = true;
			}
		}
		return isBoost;
	}

	isSummonSpell(spell) {
		var spellLevel = spell.spellLevel;
		var spellLevelId = spell.getSpellLevelId();
		for (var i = 0; i < spell.getEffectsIds().length; i++) {
			var effect = spell.effectInstances[spellLevelId + "-effects-" + i];
			if (effect.requiresInvocationDescription()) {
				return true;
			}
		}
		return false;
	}

	isSelfTargettable(spell) {
		var spellLevel = spell.spellLevel;
		var spellLevelId = spell.getSpellLevelId();
		for (var i = 0; i < spell.getEffectsIds().length; i++) {
			var effect = spell.effectInstances[spellLevelId + "-effects-" + i];
			var targetMask = effect.targetMask.split(',');
			if (targetMask.indexOf('h') != -1 &&
				targetMask.indexOf('i') != -1 &&
				targetMask.indexOf('m') != -1 &&
				targetMask.indexOf('s') != -1) {
				return false;
			}
		}
		return true;
	}

	applyFighterResistance(damage, fighter, type) {
		var neutralResistance = fighter.data.stats.neutralElementResistPercent;
		var neutralReduction = fighter.data.stats.neutralElementReduction;
		var fireResistance = fighter.data.stats.fireElementResistPercent;
		var fireReduction = fighter.data.stats.fireElementReduction;
		var earthResistance = fighter.data.stats.earthElementResistPercent;
		var earthReduction = fighter.data.stats.earthElementReduction;
		var waterResistance = fighter.data.stats.waterElementResistPercent;
		var waterReduction = fighter.data.stats.waterElementReduction;
		var airResistance = fighter.data.stats.airElementResistPercent;
		var airReduction = fighter.data.stats.airElementReduction;
		var reduction = 0;
		var resistance = 0;
		switch (type) {
			case "water":
			reduction = waterReduction;
			resistance = waterResistance;
			break;
			case "fire":
			reduction = fireReduction;
			resistance = fireResistance;
			break;
			case "earth":
			reduction = earthReduction;
			resistance = earthResistance;
			break;
			case "air":
			reduction = airReduction;
			resistance = airResistance;
			break;
			case "neutral":
			reduction = neutralReduction;
			resistance = neutralResistance;
			break;
		}
		var realDamage = damage - reduction - (damage - reduction) * (resistance/100);
		return realDamage;
	}

	getSpellEffectDamage(spell, fighter, impactCellId) {
		var fighterCellId = fighter.data.disposition.cellId;
		var fighterMaxLifePoints = fighter.data.stats.maxLifePoints;
		var distance = this.window.utils.losDetector.getCellDistance(impactCellId, fighterCellId);
		var stats = this.getFighterStats();
		var intelligence = stats.intelligence.alignGiftBonus + stats.intelligence.base + stats.intelligence.contextModif + stats.intelligence.objectsAndMountBonus;
		var fireDamageBonus = stats.fireDamageBonus.alignGiftBonus + stats.fireDamageBonus.base + stats.fireDamageBonus.contextModif + stats.fireDamageBonus.objectsAndMountBonus;
		var chance = stats.chance.alignGiftBonus + stats.chance.base + stats.chance.contextModif + stats.chance.objectsAndMountBonus;
		var waterDamageBonus = stats.waterDamageBonus.alignGiftBonus + stats.waterDamageBonus.base + stats.waterDamageBonus.contextModif + stats.waterDamageBonus.objectsAndMountBonus;
		var agility = stats.agility.alignGiftBonus + stats.agility.base + stats.agility.contextModif + stats.agility.objectsAndMountBonus;
		var airDamageBonus = stats.airDamageBonus.alignGiftBonus + stats.airDamageBonus.base + stats.airDamageBonus.contextModif + stats.airDamageBonus.objectsAndMountBonus;
		var strength = stats.strength.alignGiftBonus + stats.strength.base + stats.strength.contextModif + stats.strength.objectsAndMountBonus;
		var earthDamageBonus = stats.earthDamageBonus.alignGiftBonus + stats.earthDamageBonus.base + stats.earthDamageBonus.contextModif + stats.earthDamageBonus.objectsAndMountBonus;
		var neutralDamageBonus = stats.neutralDamageBonus.alignGiftBonus + stats.neutralDamageBonus.base + stats.neutralDamageBonus.contextModif + stats.neutralDamageBonus.objectsAndMountBonus;
		var allDamagesBonus = stats.allDamagesBonus.alignGiftBonus + stats.allDamagesBonus.base + stats.allDamagesBonus.contextModif + stats.allDamagesBonus.objectsAndMountBonus;
		var damagesBonusPercent = stats.damagesBonusPercent.alignGiftBonus + stats.damagesBonusPercent.base + stats.damagesBonusPercent.contextModif + stats.damagesBonusPercent.objectsAndMountBonus;
		var finalDamage = 0;
		var spellLevel = spell.spellLevel;
		var spellLevelId = spell.getSpellLevelId();
		for (var i = 0; i < spell.getEffectsIds().length; i++) {
			var damage = 0;
			var type = 0;
			var effect = spell.effectInstances[spellLevelId + "-effects-" + i];
			var tmpDamage = (effect.diceSide ? (effect.diceNum + effect.diceSide)/2 : effect.diceNum);
			if (this.waterEffects.indexOf(effect.effectId) != -1) {
				damage += tmpDamage * (100+chance+damagesBonusPercent) / 100 + waterDamageBonus;
				damage = this.applyFighterResistance(damage, fighter, "water");
			} else if (this.earthEffects.indexOf(effect.effectId) != -1) {
				damage += tmpDamage * (100+strength+damagesBonusPercent) / 100 + earthDamageBonus;
				damage = this.applyFighterResistance(damage, fighter, "earth");
			} else if (this.airEffects.indexOf(effect.effectId) != -1) {
				damage += tmpDamage * (100+agility+damagesBonusPercent) / 100 + airDamageBonus;
				damage = this.applyFighterResistance(damage, fighter, "air");
			} else if (this.fireEffects.indexOf(effect.effectId) != -1) {
				damage += tmpDamage * (100+intelligence+damagesBonusPercent) / 100 + fireDamageBonus;
				damage = this.applyFighterResistance(damage, fighter, "fire");
			} else if (this.neutralEffects.indexOf(effect.effectId) != -1) {
				damage += tmpDamage * (100+strength+damagesBonusPercent) / 100 + neutralDamageBonus;
				damage = this.applyFighterResistance(damage, fighter, "neutral");
			}
			finalDamage += damage*(10-distance)/10;
		}
		return finalDamage;
	}

	getFormattedTargetCellData(spell, fromCellId, toCellId, addRatio, distance) {
		if (!addRatio) {
			addRatio = 0;
		}
		if (!distance) {
			distance = 0;
		}
		var nbEnemies = 0;
		var nbAllies = 0;
		var ratio = 0;
		if (spell) {
			var spellLevel = spell.spellLevel;
			var spellEffectZone = this.getSpellEffectZone(spell, fromCellId, toCellId);
			var distanceRatio = distance != 0 ? distance/100 : 0;
			var enemies = this.getEnemiesInZone(spellEffectZone);
			nbEnemies = enemies.length;
			nbAllies = addRatio ? 0 : this.getAlliesInZone(spellEffectZone).length;
			var spellEffectRatio = 0;
      var totalSpellEffectDamage = 0;
			for (var i = 0; i < enemies.length; i++) {
				var spellEffectDamage = this.getSpellEffectDamage(spell, enemies[i], toCellId);
        totalSpellEffectDamage += spellEffectDamage;
        var r = spellEffectDamage / 100;
    		var fighterLifePoints = enemies[i].data.stats.lifePoints;
    		if (spellEffectDamage >= fighterLifePoints) {
          r = fighterLifePoints / 100 + this.killRatio;
    		}
        spellEffectRatio += r;
			}
			nbAllies = nbAllies > 0 ? nbAllies - (this.isSelfTargettable(spell) ? 0 : 1) : 0;
			var k = nbAllies * this.allyRatio;
      var spellCostRatio = totalSpellEffectDamage / Math.pow(spellLevel.apCost, 3);
			ratio = nbEnemies - k + addRatio - distanceRatio + spellEffectRatio + spellCostRatio;
			ratio = ratio < 0 ? 0 : ratio;
		}
		return {
			cellId: toCellId,
			nbAllies: nbAllies,
			nbEnemies: nbEnemies,
			ratio: ratio
		}
	}

	getBestTargetCell(spell, fromCellId, distance) {
		var spellLevel = spell.spellLevel;
		var sight = this.getSpellSightOfViewAtCell(fromCellId, spell);
		var bestData = this.getFormattedTargetCellData();;
		for (var i = 0; i < sight.length; i++) {
			var cellId = sight[i];
			if (!this.canCastSpell(spellLevel, this.getActorOnCell(cellId))) {
				//console.debug("1 (not good)");
				continue;
			}
			var data = this.getFormattedTargetCellData(spell, fromCellId, cellId, 0, distance);
			if (data.ratio > bestData.ratio) {
				bestData = data;
			}
		}
		return bestData;
	}

	testSpellFromCell(spell, fromCellId, distance) {
		var me = this.window.gui.fightManager.getAvailableFighters()[this.window.gui.playerData.id];
		var stats = this.getFighterStats();
		var spellLevel = spell.spellLevel;
		var cellId = 0;
		var nbEnemies = 0;
		var nbAllies = 0;
		var ratio = 0;
		if (spellLevel.apCost > stats.actionPointsCurrent) {
			return this.getFormattedTargetCellData();
		}
		if (this.isBoostSpell(spell)) {
			if (this.canCastSpell(spellLevel, me)) {
				return this.getFormattedTargetCellData(spell, fromCellId, fromCellId, this.boostRatio, distance);
			}
		}
		if (this.isSummonSpell(spell)) {
			var closest = this.getClosestFighterOfCell(fromCellId, this.getAliveEnemies());
			console.debug("Summoning on cell " + closest);
			if (closest) {
				var cellSummon = this.closestAvailableCellFrom(spell, fromCellId, closest.data.disposition.cellId);
				if (cellSummon) {
					if (this.canCastSpell(spellLevel, me)) {
						return this.getFormattedTargetCellData(spell, fromCellId, cellSummon, this.summonRatio, distance);
					}
				}
			}
		}
		if (this.isDamageSpell(spell)) {
			return this.getBestTargetCell(spell, fromCellId, distance);
		}
		return this.getFormattedTargetCellData();
	}

	getWhatSpellToCast() {
		var stats = this.getFighterStats();
		var me = this.window.gui.fightManager.getAvailableFighters()[this.window.gui.playerData.id];
		if (!me) {
			return false;
		}
		var reachableZone = this.window.utils.getReachableZone(this.window.isoEngine.actorManager.userActor, me.data.disposition.cellId);
		var bestData = this.getFormattedTargetCellData();

		for (var i in this.spellsUsable) {
			var spell = this.spellsUsable[i];
			var data = this.testSpellFromCell(spell, me.data.disposition.cellId, 0);
			if (data.ratio > bestData.ratio) {
				bestData = data;
				bestData.spell = spell;
				bestData.fromCellId = parseInt(me.data.disposition.cellId);
			}
		}

		for (var cellId in reachableZone) {
			cellId = parseInt(cellId);
			var distance = this.window.utils.losDetector.getCellDistance(me.data.disposition.cellId, cellId);
			if (!reachableZone[cellId].reachable || reachableZone[cellId].ap > 0) {
				continue;
			}
			for (var n in this.spellsUsable) {
				var spell = this.spellsUsable[n];
				var data = this.testSpellFromCell(spell, cellId, distance);
				if (data.ratio > bestData.ratio) {
					bestData = data;
					bestData.spell = spell;
					bestData.fromCellId = cellId;
				}
			}
		}
		return bestData.spell ? bestData : false;
	}

	fight() {
		this.window.utils.inactivityManager.recordActivity();
		var everyone = this.window.gui.fightManager.getAvailableFighters();
		var me = everyone[this.window.gui.playerData.id];
		if (!this.ourTurn || !me) {
			return;
		}
		var data = this.getWhatSpellToCast();
		//console.debug('---SPELL TO CAST---', data);
		if (data) {
			if (data.fromCellId == me.data.disposition.cellId) {
				// cast spell
				this.castSpell(data.spell, data.cellId, data.fromCellId);
			} else {
				// move and cast spell
				var reachableZone = this.window.utils.getReachableZone(this.window.isoEngine.actorManager.userActor, me.data.disposition.cellId);
				var path = this.getPathFromReachableZone(reachableZone, me.data.disposition.cellId, data.fromCellId);
				var compressedPath = this.window.utils.pathFinder.compressPath(path);
				this.window.dofus.sendMessage("GameMapMovementRequestMessage", {keyMovements: compressedPath, mapId: this.window.isoEngine.mapRenderer.mapId});
				setTimeout(() => {
					this.castSpell(data.spell, data.cellId, data.fromCellId);
				}, random.integer(this.castSpellMin, this.castSpellMax));
			}
			return;
		}

		var stats = this.getFighterStats();
		var enemies = this.getAliveEnemies();
		var closest = this.getClosestFighterOfCell(me.data.disposition.cellId, enemies);
		if (!closest) {
			return;
		}
		var closestCellId = closest.data.disposition.cellId;
		var distance = this.window.utils.losDetector.getCellDistance(me.data.disposition.cellId, closestCellId);
		if (stats.movementPointsCurrent) {
			if (!this.berserker) {
				if (stats.actionPointsCurrent >= 6) {
					if (this.moveCloserTo(closestCellId, distance)) {
						return;
					}
				}
				if (this.moveAway()) {
					return;
				}
			} else {
				if (this.moveCloserTo(closestCellId, distance)) {
					return;
				}
			}
		}
		this.finishMyTurn();
	}

	anotherAction() {
		setTimeout(() => {
			this.fight();
		}, random.integer(this.actionMin, this.actionMax));
	}


}

export default Fighter;
