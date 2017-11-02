import React from 'react';

import Widget from './Widget';
import Module from '../Module';

import LevelMinMax from '../modules/xper/LevelMinMax';

class XPer extends Module {
  constructor(props) {
    super(props);
    this.tag = "xper";
    this.state._[this.tag] = false;
  }

  onEnable() {
    console.debug("[XPER] started");
    this.props.win.Dofucks.Farmer.XPer.enable();
    this.setValue(true);
  }

  onDisable() {
    console.debug("[XPER] stopped");
    this.props.win.Dofucks.Farmer.XPer.disable();
    this.setValue(false);
  }

  onLoaded(data) {
    if (data) {
      setTimeout(() => {this.onEnable()}, 3000);
    }
    return data;
  }

  render() {
    return (
      <Widget title="XPer"
        activable={true}
        enabled={this.state._[this.tag]}
        onEnable={this.onEnable.bind(this)}
        onDisable={this.onDisable.bind(this)}
      >
        <LevelMinMax win={this.props.win} />
      </Widget>
    )
  }
}

export default XPer;
