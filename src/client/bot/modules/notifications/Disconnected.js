import React from 'react';

import Notification from '../../Notification';
import Checkbox from 'material-ui/Checkbox';
import {ListItem} from 'material-ui/List';
import VolumeOff from 'material-ui/svg-icons/av/volume-off';
import VolumeOn from 'material-ui/svg-icons/av/volume-up';

class Disconnected extends Notification {
  constructor(props) {
    super(props);
    this.tag = "notif_disconnect";
    this.state._[this.tag] = {
      audio: false,
      notif: false
    };
  }

  ready() {
    var dc = this.props.win.dofus.disconnect;
    this.props.win.dofus.disconnect = (reason) => {
      this.disconnected(reason);
      dc(reason);
    };
  }

  disconnected(reason) {
    if (this.state._[this.tag].notif) {
      this.sendNotif("Disconnected", "You have been disconnected"+(reason ? " ("+reason+")." : "."));
    }
    if (this.state._[this.tag].audio) {
      this.playAudio('disconnected');
    }
  }

  render() {
    var icon = <Checkbox checked={this.state._[this.tag].audio} onCheck={this.onToggleAudio.bind(this)} checkedIcon={<VolumeOn />} uncheckedIcon={<VolumeOff />}/>
    var cb = <Checkbox checked={this.state._[this.tag].notif} onCheck={this.onToggleNotif.bind(this)}/>
    return (
      <ListItem
        primaryText="Disconnected"
        rightToggle={icon}
        leftCheckbox={cb}
      />
    )
  }
}

export default Disconnected;
