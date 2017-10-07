import React from 'react';

import Module from '../../Module';
import Checkbox from 'material-ui/Checkbox';
import {ListItem} from 'material-ui/List';

var random = require("random-js")();

class CloseFightEndWindow extends Module {
  constructor(props) {
    super(props);
    this.tag = "fighter_close_results";
    this.state._[this.tag] = false;
  }

  ready() {
    this.props.win.dofus.connectionManager.on('GameFightEndMessage', this.GameFightEndMessage.bind(this));
  }

  onActivate() {
    console.debug("[AUTO-CLOSE-RESULTS] activated");
    this.setValue(true);
  }

  onDeactivate() {
    console.debug("[AUTO-CLOSE-RESULTS] deactivated");
    this.setValue(false);
  }

  GameFightEndMessage(e) {
    if (!this.state._[this.tag]) {
      return;
    }
		setTimeout(() => {
      this.props.win.Dofucks.Utils.closeWindow("FightEndWindow");
		}, random.integer(500, 2000));
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
        primaryText="Auto-close fight results"
        rightToggle={<Checkbox onCheck={this.onCheck.bind(this)} checked={this.state._[this.tag]}/>}
      />
    );
  }
}

export default CloseFightEndWindow;
