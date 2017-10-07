import React from 'react';

import Notification from '../../Notification';
import Checkbox from 'material-ui/Checkbox';
import {ListItem} from 'material-ui/List';
import VolumeOff from 'material-ui/svg-icons/av/volume-off';
import VolumeOn from 'material-ui/svg-icons/av/volume-up';

class TalkInPrivate extends Notification {
  constructor(props) {
    super(props);
    this.tag = "notif_talkinprivate";
    this.state._[this.tag] = {
      audio: false,
      notif: false
    };
  }

  ready() {
    this.props.win.dofus.connectionManager.on("ChatServerMessage", this.ChatServerMessage.bind(this));
  }

  ChatServerMessage(e) {
    if (e.channel == 9) {
      if (e.senderName) {
        if (this.state._[this.tag].notif) {
          this.sendNotif("Private message ("+e.senderName+")", e.content);
        }
        if (this.state._[this.tag].audio) {
          this.playAudio('private-message');
        }
      }
    }
  }

  render() {
    var icon = <Checkbox checked={this.state._[this.tag].audio} onCheck={this.onToggleAudio.bind(this)} checkedIcon={<VolumeOn />} uncheckedIcon={<VolumeOff />}/>
    var cb = <Checkbox checked={this.state._[this.tag].notif} onCheck={this.onToggleNotif.bind(this)}/>
    return (
      <ListItem
        primaryText="Private message"
        rightToggle={icon}
        leftCheckbox={cb}
      />
    )
  }
}

export default TalkInPrivate;
