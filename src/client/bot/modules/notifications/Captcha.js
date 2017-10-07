import React from 'react';

import Notification from '../../Notification';
import Checkbox from 'material-ui/Checkbox';
import {ListItem} from 'material-ui/List';
import VolumeOff from 'material-ui/svg-icons/av/volume-off';
import VolumeOn from 'material-ui/svg-icons/av/volume-up';

class Captcha extends Notification {
  constructor(props) {
    super(props);
    this.tag = "notif_captcha";
    this.state._[this.tag] = {
      audio: false,
      notif: false
    };
  }

  ready() {
    this.props.win.dofus.connectionManager.on("RecaptchaRequestMessage", this.RecaptchaRequestMessage.bind(this));
  }

  RecaptchaRequestMessage(e) {
    if (this.state._[this.tag].notif) {
      this.sendNotif("Recaptcha Request", "You need to resolve the captcha.");
    }
    if (this.state._[this.tag].audio) {
      this.playAudio('recaptcha');
    }
  }

  render() {
    var icon = <Checkbox checked={this.state._[this.tag].audio} onCheck={this.onToggleAudio.bind(this)} checkedIcon={<VolumeOn />} uncheckedIcon={<VolumeOff />}/>
    var cb = <Checkbox checked={this.state._[this.tag].notif} onCheck={this.onToggleNotif.bind(this)}/>
    return (
      <ListItem
        primaryText="Captcha request"
        rightToggle={icon}
        leftCheckbox={cb}
      />
    )
  }
}

export default Captcha;
