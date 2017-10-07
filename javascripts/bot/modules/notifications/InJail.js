import React from 'react';

import Notification from '../../Notification';
import Checkbox from 'material-ui/Checkbox';
import {ListItem} from 'material-ui/List';
import VolumeOff from 'material-ui/svg-icons/av/volume-off';
import VolumeOn from 'material-ui/svg-icons/av/volume-up';

class InJail extends Notification {
  constructor(props) {
    super(props);
    this.tag = "notif_in_jail";
    this.state._[this.tag] = {
      notif: false,
      audio: false
    };
  }

  ready() {
    this.props.win.dofus.connectionManager.on("CurrentMapMessage", this.CurrentMapMessage.bind(this));
    this.props.win.dofus.connectionManager.on("_ErrorPopupMessage", this._ErrorPopupMessage.bind(this));
    this.setOptionValue('notif', true);
  }

  CurrentMapMessage(e) {
    if ([148278, 105119744, 105120002, 105121026].indexOf(e.mapId) != -1) {
      if (this.state._[this.tag].audio) {
        this.playAudio('injail');
      }
      if (this.state._[this.tag].notif) {
        this.sendNotif("ALERT JAIL", "WARNING YOU ARE IN JAIL");
      }
      setTimeout(() => {
        this.props.win.isoEngine._movePlayerOnMap(328, true, () => {
          setTimeout(() => {
            this.props.win.gui.chat.chatInput.inputChat.setValue("Euh... Pourquoi ? O.o");
            this.props.win.gui.chat.chatInput._submit();
            setTimeout(() => {
              this.props.win.isoEngine._movePlayerOnMap(41);
            }, 10000);
          }, 2000);
        });
      }, 3000);
    }
  }

  _ErrorPopupMessage(e) {
    if (this.state._[this.tag].notif) {
      this.sendNotif("WARNING: "+ e.title, e.text);
    }
  }

  render() {
  var icon = <Checkbox checked={this.state._[this.tag].audio} onCheck={this.onToggleAudio.bind(this)} checkedIcon={<VolumeOn />} uncheckedIcon={<VolumeOff />}/>
  var cb = <Checkbox checked={true} disabled={true}/>
    return (
      <ListItem
        primaryText="In jail"
        rightToggle={icon}
        leftCheckbox={cb}
      />
    )
  }
}

export default InJail;
