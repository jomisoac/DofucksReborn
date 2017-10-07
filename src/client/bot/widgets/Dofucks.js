import React from 'react';

import {List} from 'material-ui/List';

import Widget from './Widget';

import AutoFollower from '../modules/AutoFollower';
import AchievementValidator from '../modules/AchievementValidator';
import WeightLimitActivity from '../modules/WeightLimitActivity';
import LevelAndXpDisplayer from '../modules/LevelAndXpDisplayer';
import PathChooser from '../modules/PathChooser';
import SpeedHack from '../modules/SpeedHack';

class Dofucks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    return (
      <Widget title="Dofucks">
        <LevelAndXpDisplayer win={this.props.win}/>
        <List>
          <SpeedHack win={this.props.win}/>
          <AchievementValidator win={this.props.win}/>
          <AutoFollower win={this.props.win}/>
        </List>
        <WeightLimitActivity win={this.props.win}/>
        <PathChooser win={this.props.win}/>
      </Widget>
    )
  }
}

export default Dofucks;
