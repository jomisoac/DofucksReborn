import React from 'react';
import Module from '../Module';
import Subheader from 'material-ui/Subheader';
import LinearProgress from 'material-ui/LinearProgress';

class LevelAndXpDisplayer extends Module {
  constructor(props) {
    super(props);
    this.state = {
      level: 0,
      xp: 0,
      name: "N/A"
    }
  }

  ready() {
    this.props.win.dofus.connectionManager.on("CharacterSelectedSuccessMessage", this.CharacterSelectedSuccessMessage.bind(this));
    this.props.win.dofus.connectionManager.on("CharacterStatsListMessage", this.CharacterStatsListMessage.bind(this));
    this.props.win.dofus.connectionManager.on("CharacterLevelUpMessage", this.CharacterLevelUpMessage.bind(this));
  }

  CharacterSelectedSuccessMessage(e) {
    this.setState({
      name: e.infos.name,
      level: e.infos.level
    });
  }

  CharacterStatsListMessage(e) {
  	var xp = e.stats.experience - e.stats.experienceLevelFloor;
  	var xpnlvl = e.stats.experienceNextLevelFloor - e.stats.experienceLevelFloor;
    this.setState({
      xp: parseFloat((xp*100/xpnlvl).toFixed(2))
    });
  }

  CharacterLevelUpMessage(e) {
	   this.setState({
       level: e.newLevel
     });
  }

  render() {
    return (
      <div>
        <Subheader>{this.state.name} ({this.state.level}) - {this.state.xp}%</Subheader>
        <LinearProgress mode="determinate" value={this.state.xp} />
      </div>
    )
  }
}

export default LevelAndXpDisplayer;
