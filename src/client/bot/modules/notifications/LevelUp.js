import React from 'react';

import Notification from '../../Notification';
import Checkbox from 'material-ui/Checkbox';
import {ListItem} from 'material-ui/List';
import VolumeOff from 'material-ui/svg-icons/av/volume-off';
import VolumeOn from 'material-ui/svg-icons/av/volume-up';

class LevelUp extends Notification {
  constructor(props) {
    super(props);
    this.tag = "notif_levelup";
    this.state._[this.tag] = {
      notif: false,
      audio: false
    };
  }

  ready() {
    this.props.win.dofus.connectionManager.on("CharacterLevelUpMessage", this.CharacterLevelUpMessage.bind(this));
  }

  CharacterLevelUpMessage(e) {
    if (this.state._[this.tag].audio) {
      this.playAudio('levelup');
    }
    if (this.state._[this.tag].notif) {
      this.sendNotif("Congrats !", "You are now level "+e.newLevel+" !");
    }
  }

  render() {
  var icon = <Checkbox checked={this.state._[this.tag].audio} onCheck={this.onToggleAudio.bind(this)} checkedIcon={<VolumeOn />} uncheckedIcon={<VolumeOff />}/>
  var cb = <Checkbox checked={this.state._[this.tag].notif} onCheck={this.onToggleNotif.bind(this)}/>
    return (
      <ListItem
        primaryText="Level Up"
        rightToggle={icon}
        leftCheckbox={cb}
      />
    )
  }
}

export default LevelUp;
