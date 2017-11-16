import React from 'react';

import Module from '../../Module';
import Checkbox from 'material-ui/Checkbox';
import {ListItem} from 'material-ui/List';

var random = require("random-js")();

class CloseLevelUpWindow extends Module {
  constructor(props) {
    super(props);
    this.tag = "fighter_close_lvlup";
    this.state._[this.tag] = false;
  }

  ready() {
    this.props.win.dofus.connectionManager.on('CharacterLevelUpMessage', this.CharacterLevelUpMessage.bind(this));
  }

  onActivate() {
    console.debug("[AUTO-CLOSE-LVLUP] activated");
    this.setValue(true);
  }

  onDeactivate() {
    console.debug("[AUTO-CLOSE-LVLUP] deactivated");
    this.setValue(false);
  }

  CharacterLevelUpMessage(e) {
    if (!this.state._[this.tag]) {
      return;
    }
		setTimeout(() => {
      this.props.win.Dofucks.Utils.closeWindow("LevelUpWindow");
		}, random.integer(2000, 4000));
	}

  onLoaded(data) {
    if (data) {
      this.onActivate();
    }
    return data;
  }

  onCheck(e, isChecked) {
    if (isChecked) {
      this.onActivate();
    } else {
      this.onDeactivate();
    }
  }

  render() {
    return (
      <ListItem
        primaryText="Auto-close level up window"
        rightToggle={<Checkbox onCheck={this.onCheck.bind(this)} checked={this.state._[this.tag]}/>}
      />
    );
  }
}

export default CloseLevelUpWindow;
