import React from 'react';

import {NotifOptions} from './Options';
import Module from './Module';

class Notification extends Module {
  constructor(props) {
    super(props);
  }

  ready() {

  }

  onToggleAudio(e, checked) {
    if (checked) {
      this.enableAudio();
    } else {
      this.disableAudio();
    }
  }

  onToggleNotif(e, checked) {
    if (checked) {
      this.enableNotif();
    } else {
      this.disableNotif();
    }
  }

  enableAudio() {
    this.setOptionValue('audio', true);
  }

  disableAudio() {
    this.setOptionValue('audio', false);
  }

  enableNotif() {
    this.setOptionValue('notif', true);
  }

  disableNotif() {
    this.setOptionValue('notif', false);
  }

  playAudio(path) {
    var audio = new Audio('./sounds/'+path+'.mp3');
    try {
      audio.play();
    } catch (e) {
      console.error("Can't play audio: "+e);
    }
  }

  sendNotif(title, content, tag, icon) {
    var options = NotifOptions;
    options.body = content;
    if (tag != undefined) {
      options.tag = tag;
    }
    if (icon != undefined) {
      options.icon = icon;
    }
    new window.Notification(title, options);
  }
}


export default Notification;
