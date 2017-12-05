import React from 'react';

import Widget from './Widget';
import Module from '../Module';

import {List} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import LevelUp from '../modules/notifications/LevelUp';
import InJail from '../modules/notifications/InJail';
import Captcha from '../modules/notifications/Captcha';
import TalkInPrivate from '../modules/notifications/TalkInPrivate';
import FightStart from '../modules/notifications/fight/FightStart';
import FightEnd from '../modules/notifications/fight/FightEnd';
import TurnStart from '../modules/notifications/fight/TurnStart';
import ModeratorOnMap from '../modules/notifications/ModeratorOnMap';
import Disconnected from '../modules/notifications/Disconnected';

class Notifications extends Module {
  constructor(props) {
    super(props);
  }

  onLoaded(data) {
    if (data.audio) {
      this.enableAudio();
    }
    if (data.notif) {
      this.enableNotif();
    }
    return data;
  }

  render() {
    return (
      <Widget title="Notifications">
        <List>
          <LevelUp win={this.props.win}/>
          <TalkInPrivate win={this.props.win}/>
          <Disconnected win={this.props.win}/>
          <Subheader>Fight</Subheader>
          <FightStart win={this.props.win}/>
          <FightEnd win={this.props.win}/>
          <TurnStart win={this.props.win}/>
          <Subheader>Other</Subheader>
          <InJail win={this.props.win}/>
          <Captcha win={this.props.win}/>
          <ModeratorOnMap win={this.props.win}/>
        </List>
      </Widget>
    )
  }
}

export default Notifications;
