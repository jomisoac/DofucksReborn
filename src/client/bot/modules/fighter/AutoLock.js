import React from 'react';

import Module from '../../Module';
import Toggle from 'material-ui/Toggle';
import {ListItem} from 'material-ui/List';

class AutoLock extends Module {
  constructor(props) {
    super(props),
    this.tag = "fighter_autolock";
    this.state._[this.tag] = false;
  }

  ready() {
    this.props.win.dofus.connectionManager.on('GameFightPlacementPossiblePositionsMessage', this.GameFightPlacementPossiblePositionsMessage.bind(this));
  }

  onActivate() {
    console.debug("[AUTO-LOCK] activated");
    this.setValue(true);
  }

  onDeactivate() {
    console.debug("[AUTO-LOCK] deactivated");
    this.setValue(false);
  }

  GameFightPlacementPossiblePositionsMessage(e) {
    var activated = this.state._[this.tag];
    if (  activated && !this.props.win.gui.mainControls.fightLocked
      || !activated && this.props.win.gui.mainControls.fightLocked) {
			this.props.win.gui.mainControls.fightLocked = !this.props.win.gui.mainControls.fightLocked;
			this.props.win.dofus.connectionManager.sendMessage("GameFightOptionToggleMessage", {option: 2});
		}
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
        primaryText="Auto-lock"
        rightToggle={<Toggle onToggle={this.onToggle.bind(this)} toggled={this.state._[this.tag]}/>}
      />
    );
  }
}

export default AutoLock;
