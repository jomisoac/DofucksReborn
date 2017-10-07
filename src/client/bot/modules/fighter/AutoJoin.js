import React from 'react';

import Module from '../../Module';
import Toggle from 'material-ui/Toggle';
import {ListItem} from 'material-ui/List';

var random = require("random-js")();

class AutoJoin extends Module {
  constructor(props) {
    super(props);
    this.tag = "fighter_autojoin";
    this.state._[this.tag] = false;
  }

  ready() {
    this.props.win.dofus.connectionManager.on('PartyMemberInFightMessage', this.PartyMemberInFightMessage.bind(this));
  }

  onActivate() {
    console.debug("[AUTO-JOIN] activated");
    this.setValue(true);
  }

  onDeactivate() {
    console.debug("[AUTO-JOIN] deactivated");
    this.setValue(false);
  }

  PartyMemberInFightMessage(e) {
    if (!this.state._[this.tag]) {
      return;
    }
		setTimeout(() => {
			if (this.props.win.isoEngine.mapRenderer.mapId == e.fightMap.mapId) {
				this.props.win.dofus.sendMessage("GameFightJoinRequestMessage", {
					fighterId: e.memberId,
					fightId: e.fightId
				});
			}
		}, random.integer(200, 400));
	}

  onLoaded(data) {
    if (data) {
      this.onActivate();
    }
    return data;
  }

  onToggle(e, isChecked) {
    if (isChecked) {
      this.onActivate();
    } else {
      this.onDeactivate();
    }
  }

  render() {
    return (
      <ListItem
        primaryText="Auto-join party fights"
        rightToggle={<Toggle onToggle={this.onToggle.bind(this)} toggled={this.state._[this.tag]}/>}
      />
    );
  }
}

export default AutoJoin;
