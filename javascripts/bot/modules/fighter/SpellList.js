import React from 'react';

import Module from '../../Module';
import Spell from './SpellList/Spell';
import { Grid, Row, Cell } from 'react-inline-grid';

class SpellList extends Module {
  constructor(props) {
    super(props)
    this.tag = "spells_to_use";
    this.state["spells"] = []
    this.state._[this.tag] = [];
    this.stateSpells = [];
  }

  ready() {
    this.props.win.dofus.connectionManager.on('SpellListMessage', this.SpellListMessage.bind(this));
    this.props.win.dofus.connectionManager.on('SpellUpgradeSuccessMessage', this.SpellUpgradeSuccessMessage.bind(this));
  }

  addSpell(spellId, spellLevel) {
    var spespell = this.props.win.gui.playerData.characters.mainCharacter.spellData.spells[spellId];
    if (spespell && spespell.spell) {
      this.stateSpells.push({
        spellId: spellId,
        spellLevel: spellLevel,
        iconId: spespell.spell.iconId
      });
    }
  }

  SpellListMessage(e) {
    this.stateSpells = [];
  	var spells = e.spells;
  	this.props.win.gui.playerData.characters.once('spellList', () => {
  		for (var i = 0; i < spells.length; i++) {
  			var spell = spells[i];
  			var spellId = spell.spellId;
  			var spellLevel = spell.spellLevel;
        this.addSpell(spellId, spellLevel);
  		}
      this.setState({
        spells: this.stateSpells
      });
  	});
	}

  SpellUpgradeSuccessMessage(e) {
    var spellId = e.spellId;
    if (e.spellLevel == 1) {
      this.addSpell(spellId, 1);
      this.setState({
        spells: this.stateSpells
      });
    }
  }

  onSelectSpell(id, selected) {
    var arr = this.state._[this.tag];
    var index = arr.indexOf(id);
    if (selected && index === -1) {
      arr.push(id);
    } else if (!selected && index > -1) {
      arr.splice(index, 1);
    }
    this.props.win.Dofucks.Fighter.spellsToUse = arr;
    this.setValue(arr);
  }

  onLoaded(data) {
    this.props.win.Dofucks.Fighter.spellsToUse = data;
    return data;
  }

  render() {
    return (
      <Grid>
        <Row is="nospace">
          {
            this.state.spells.map((e, i) => {
              return (
                <Spell key={i} spellId={e.spellId} iconId={e.iconId}
                onSelectSpell={this.onSelectSpell.bind(this)}
                selected={this.state._[this.tag].indexOf(e.spellId) !== -1}
                />
              )
            })
          }
        </Row>
      </Grid>
    );
  }
}

export default SpellList;
