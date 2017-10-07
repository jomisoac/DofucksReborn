import React from 'react';

import Module from '../../Module';
import Toggle from 'material-ui/Toggle';
import {ListItem} from 'material-ui/List';

class FightMode extends Module {
  constructor(props) {
    super(props);
    this.tag = "fighter_berserker";
    this.state._[this.tag] = false;
  }

  ready() {

  }

  onActivate() {
    console.debug("[BERSERKER] activated");
    this.props.win.Dofucks.Fighter.berserker = true;
    this.setValue(true);
  }

  onDeactivate() {
    console.debug("[BERSERKER] deactivated");
    this.props.win.Dofucks.Fighter.berserker = false;
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
        primaryText="Berserker"
        rightToggle={<Toggle toggled={this.state._[this.tag]} onToggle={this.onToggle.bind(this)}/>}
      />
    );
  }
}

export default FightMode;
