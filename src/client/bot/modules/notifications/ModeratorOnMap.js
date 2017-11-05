import React from 'react';

import Notification from '../../Notification';
import Checkbox from 'material-ui/Checkbox';
import {ListItem} from 'material-ui/List';
import VolumeOff from 'material-ui/svg-icons/av/volume-off';
import VolumeOn from 'material-ui/svg-icons/av/volume-up';

class ModeratorOnMap extends Notification {
  constructor(props) {
    super(props);
    this.tag = "notif_moderatoronmap";
    this.state._[this.tag] = {
      audio: false,
      notif: true
    };
    this.saw = {};
  }

  ready() {
    this.props.win.dofus.connectionManager.on('GameRolePlayShowActorMessage', this.GameRolePlayShowActorMessage.bind(this));
    this.props.win.dofus.connectionManager.on('MapComplementaryInformationsDataMessage', this.MapComplementaryInformationsDataMessage.bind(this));
  }

  checkName(name) {
    if (name && name.indexOf('[') !== -1) {
      this.addSeen(name);
      this.notify(name);
      return true;
    }
    return false;
  }

  GameRolePlayShowActorMessage(e) {
    var name = e.informations.name;
    this.checkName(name);
  }

  MapComplementaryInformationsDataMessage(e) {
    var t = 0;
    for (var i = 0; i < e.actors.length; i++) {
      var actor = e.actors[i];
      this.checkName(actor.name)
    }
  }

  notify(name) {
    if (this.state._[this.tag].notif) {
      this.sendNotif(name + " is on the map.", "You've seen him "+this.saw[name]+" times");
    }
    if (this.state._[this.tag].audio) {
      this.playAudio('moderator');
    }
  }

  addSeen(name) {
    var seen = this.saw[name];
    if (!seen) {
      this.saw[name] = 1;
    } else {
      this.saw[name] += 1;
    }
  }

  render() {
    var icon = <Checkbox checked={this.state._[this.tag].audio} onCheck={this.onToggleAudio.bind(this)} checkedIcon={<VolumeOn />} uncheckedIcon={<VolumeOff />}/>
    var cb = <Checkbox checked={this.state._[this.tag].notif} onCheck={this.onToggleNotif.bind(this)}/>
    return (
      <ListItem
        primaryText="Moderator on same map"
        rightToggle={icon}
        leftCheckbox={cb}
      />
    )
  }
}

export default ModeratorOnMap;
