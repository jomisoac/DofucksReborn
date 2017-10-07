import React from 'react';

import Widget from './Widget';
import Module from '../Module';

import {List} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import FightMode from '../modules/fighter/FightMode';
import AutoJoin from '../modules/fighter/AutoJoin';
import AutoLock from '../modules/fighter/AutoLock';
import AutoSkipTurn from '../modules/fighter/AutoSkipTurn';
import CloseFightEndWindow from '../modules/fighter/CloseFightEndWindow';
import Timers from '../modules/fighter/Timers';
import Priorities from '../modules/fighter/Priorities';
import SpellList from '../modules/fighter/SpellList';

class Fighter extends Module {
  constructor(props) {
    super(props);
    this.tag = "fighter";
    this.state._[this.tag] = false;
  }

  onEnable() {
    console.debug("[FIGHTER] started");
    this.props.win.Dofucks.Fighter.enabled = true;
    this.setValue(true);
  }

  onDisable() {
    console.debug("[FIGHTER] stopped");
    this.props.win.Dofucks.Fighter.enabled = false;
    this.setValue(false);
  }

  onLoaded(data) {
    if (data) {
      this.onEnable();
      return true;
    }
    return false;
  }

  render() {
    return (
      <Widget title="Fighter"
        activable={true}
        enabled={this.state._[this.tag]}
        onEnable={this.onEnable.bind(this)}
        onDisable={this.onDisable.bind(this)}
      >
        <List>
          <FightMode win={this.props.win}/>
          <AutoJoin win={this.props.win}/>
          <AutoLock win={this.props.win}/>
          <AutoSkipTurn win={this.props.win}/>
          <CloseFightEndWindow win={this.props.win}/>
        </List>
        <Timers win={this.props.win}/>
        <Priorities win={this.props.win}/>
        <Subheader>Spells (click to toggle usability)</Subheader>
        <SpellList win={this.props.win}/>
      </Widget>
    )
  }
}

export default Fighter;
