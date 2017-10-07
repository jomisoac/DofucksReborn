import React from 'react';

import Module from '../Module';
import Toggle from 'material-ui/Toggle';
import {ListItem} from 'material-ui/List';

class AchievementValidator extends Module {
  constructor(props) {
    super(props);
    this.tag = "achievement_validator";
    this.state._[this.tag] = false;
  }

  ready() {
  }

  start() {
    console.debug("[ACHIEVEMENT_VALIDATOR] started");
    this.props.win.dofus.connectionManager.on("AchievementFinishedMessage", this.AchievementFinishedMessage.bind(this));
    this.setValue(true);
  }

  stop() {
    console.debug("[ACHIEVEMENT_VALIDATOR] stopped");
    this.props.win.dofus.connectionManager.removeListener("AchievementFinishedMessage", this.AchievementFinishedMessage.bind(this));
    this.setValue(false);
  }

  AchievementFinishedMessage(e) {
    this.props.win.dofus.connectionManager.sendMessage("AchievementRewardRequestMessage", {achievementId: -1});
  }

  onLoaded(data) {
    if (data) {
      this.start();
      return true;
    }
    return false;
  }

  onToggle(e, v) {
    if (v) {
      this.start();
    } else {
      this.stop();
    }
  }

  render() {
    return (
      <ListItem
        primaryText="Auto-reward achievements"
        rightToggle={<Toggle onToggle={this.onToggle.bind(this)} toggled={this.state._[this.tag]}/>}
      />
    )
  }
}

export default AchievementValidator;
