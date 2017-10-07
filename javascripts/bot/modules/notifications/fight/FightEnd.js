import React from 'react';

import Notification from '../../../Notification';
import Checkbox from 'material-ui/Checkbox';
import {ListItem} from 'material-ui/List';
import VolumeOff from 'material-ui/svg-icons/av/volume-off';
import VolumeOn from 'material-ui/svg-icons/av/volume-up';

class FightStart extends Notification {
  constructor(props) {
    super(props);
    this.tag = "notif_fight_end";
    this.state._[this.tag] = {
      audio: false,
      notif: false
    };
  }

  ready() {
    this.props.win.dofus.connectionManager.on("GameFightEndMessage", this.GameFightEndMessage.bind(this));
  }

  GameFightEndMessage(e) {
    if (this.state._[this.tag].notif) {
      this.sendNotif("End of fight", "");
    }
    if (this.state._[this.tag].audio) {
      this.playAudio('fight-end');
    }
  }

  render() {
    var icon = <Checkbox checked={this.state._[this.tag].audio} onCheck={this.onToggleAudio.bind(this)} checkedIcon={<VolumeOn />} uncheckedIcon={<VolumeOff />}/>
    var cb = <Checkbox checked={this.state._[this.tag].notif} onCheck={this.onToggleNotif.bind(this)}/>
    return (
      <ListItem
        primaryText="Fight end"
        rightToggle={icon}
        leftCheckbox={cb}
      />
    )
  }
}

export default FightStart;
