import React from 'react';

import Module from '../../Module';
import Toggle from 'material-ui/Toggle';
import {ListItem} from 'material-ui/List';

class AutoSkipTurn extends Module {
  constructor(props) {
    super(props);
    this.tag = "fighter_skip_turn";
    this.state._[this.tag] = false;
  }

  ready() {
  }

  onActivate() {
    console.debug("[AUTO_SKIP_TURN] activated");
    this.props.win.Dofucks.Fighter.skipTurn = true;
    this.setValue(true);
  }

  onDeactivate() {
    console.debug("[AUTO_SKIP_TURN] deactivated");
    this.props.win.Dofucks.Fighter.skipTurn = false;
    this.setValue(false);
  }

  onToggle(e, isChecked) {
    if (isChecked) {
      this.onActivate();
    } else {
      this.onDeactivate();
    }
  }

  onLoaded(data) {
    if (data) {
      this.onActivate();
    }
    return data;
  }

  render() {
    return (
      <ListItem
        primaryText="Auto skip turn"
        rightToggle={<Toggle toggled={this.state._[this.tag]} onToggle={this.onToggle.bind(this)}/>}
      />
    );
  }
}

export default AutoSkipTurn;
