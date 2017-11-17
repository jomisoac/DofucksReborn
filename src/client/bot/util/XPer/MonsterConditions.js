export class MonsterCondition {
  constructor(mobId, condition, count) {
    if (['<', '>', '='].indexOf(condition) === -1) {
      return new Error("Condition must be '<', '>', or '='")
    }
    this.mobId = mobId;
    this.condition = condition;
    this.count = count;
  }

  respects(mobId, count) {
    // if mob given is different, then we consider it respects
    if (mobId != this.mobId
      || (this.condition == '>' && count > this.count)
      || (this.condition == '<' && count < this.count)
      || (this.condition == '=' && count == this.count)) {
      return true;
    }
    return false;
  }
}

export class MonsterConditions {
  constructor() {
    this.conditions = [];
  }

  respectsConditions(staticInfos) {
    var mobData = this.getMobData(staticInfos);
    for (var mobId in mobData) {
      var mobCount = mobData[mobId];
      for (var i in this.conditions) {
        var condition = this.conditions[i];
        if (!condition.respects(mobId, mobCount)) {
          console.log("[XPER CONDITION] - NO", mobData)
          return false;
        }
      }
    }
    console.log("[XPER CONDITION] - YES", mobData)
    return true;
  }

  getMobData(staticInfos) {
    var mobIds = {};
    for (var i in this.conditions) {
      mobIds[this.conditions[i].mobId] = 0;
    }
    mobIds[staticInfos.mainCreatureLightInfos.creatureGenericId] = mobIds[staticInfos.mainCreatureLightInfos.creatureGenericId] ? mobIds[staticInfos.mainCreatureLightInfos.creatureGenericId] + 1 : 1;
    for (var i in staticInfos.underlings)  {
      var underling = staticInfos.underlings[i];
      var id = underling.creatureGenericId;
      mobIds[id] = mobIds[id] ? mobIds[id] + 1 : 1;
    }
    return mobIds;
  }
}

export default MonsterConditions;
