import React from 'react';

import Notification from '../../../Notification';
import Checkbox from 'material-ui/Checkbox';
import {ListItem} from 'material-ui/List';
import VolumeOff from 'material-ui/svg-icons/av/volume-off';
import VolumeOn from 'material-ui/svg-icons/av/volume-up';

class TurnStart extends Notification {
  constructor(props) {
    super(props);
    this.tag = "notif_turn_start";
    this.state._[this.tag] = {
      audio: false,
      notif: false
    };
  }

  ready() {
    this.props.win.dofus.connectionManager.on("GameFightTurnStartMessage", this.GameFightTurnStartMessage.bind(this));
  }

  GameFightTurnStartMessage(e) {
		if (this.props.win.gui.playerData.id == e.id) {
      if (this.state._[this.tag].notif) {
        this.sendNotif("It's your turn to play", "You get "+(e.waitTime/1000)+" seconds to play");
      }
      if (this.state._[this.tag].audio) {
        this.playAudio('turn-start');
      }
    }
  }

  render() {
    var icon = <Checkbox checked={this.state._[this.tag].audio} onCheck={this.onToggleAudio.bind(this)} checkedIcon={<VolumeOn />} uncheckedIcon={<VolumeOff />}/>
    var cb = <Checkbox checked={this.state._[this.tag].notif} onCheck={this.onToggleNotif.bind(this)}/>
    return (
      <ListItem
        primaryText="Turn start"
        rightToggle={icon}
        leftCheckbox={cb}
      />
    )
  }
}

export default TurnStart;
