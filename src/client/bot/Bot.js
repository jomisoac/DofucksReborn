import React from 'react';
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

import Dofucks from './widgets/Dofucks';
import Fighter from './widgets/Fighter';
import Seller from './widgets/Seller';
import Harvester from './widgets/Harvester';
import XPer from './widgets/XPer';
import Notifications from './widgets/Notifications';
import Characteristics from './widgets/Characteristics';
import GeneralOptions from './widgets/GeneralOptions';
import Sitter from './widgets/Sitter';
import Deleter from './widgets/Deleter';

import Utils from './util/Utils';
import Mover from './util/Mover';
import Path from './util/Path';
import Queue from './util/Queue';
import KeyGrabber from './util/KeyGrabber';
import DofucksFighter from './util/Fighter';
import DofucksSeller from './util/Seller';
import ItemDeleter from './util/ItemDeleter';
import Farmer from './util/Farmer';
import DofucksSitter from './util/Sitter';
import Follower from './util/Follower';
import CharacteristicsUpgrader from './util/CharacteristicsUpgrader';
import FpsManipulator from './util/FpsManipulator';

import Analytics from '../app/Analytics';

class Bot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  checkReady() {
    if (this.props.win && this.props.win.document.readyState == "complete") {
      this.ready();
    } else {
      setTimeout(() => {
        this.checkReady();
      }, 100);
    }
  }

  componentDidMount() {
    if (this.props.win) {
      this.props.win.Dofucks = {
        weightLimitPercentage: 0,
        isLocked: false,
      }
      this.props.win.Dofucks.FpsManipulator = new FpsManipulator(this.props.win);
      this.checkReady();
    } else {
      setTimeout(() => {
        this.componentDidMount();
      }, 10);
    }
  }

  ready() {
    new KeyGrabber(this.props.win);
    //this.props.win.Dofucks.Analytics = new Analytics(this.props.win);
    this.props.win.Dofucks.Utils = new Utils(this.props.win);
    this.props.win.Dofucks.Mover = new Mover(this.props.win);
    this.props.win.Dofucks.Path = new Path(this.props.win);
    this.props.win.Dofucks.Fighter = new DofucksFighter(this.props.win);
    this.props.win.Dofucks.Seller = new DofucksSeller(this.props.win);
    this.props.win.Dofucks.Deleter = new ItemDeleter(this.props.win);
    this.props.win.Dofucks.Queue = new Queue(this.props.win);
    this.props.win.Dofucks.Farmer = new Farmer(this.props.win);
    this.props.win.Dofucks.Sitter = new DofucksSitter(this.props.win);
    this.props.win.Dofucks.Follower = new Follower(this.props.win);
    this.props.win.Dofucks.CharacteristicsUpgrader = new CharacteristicsUpgrader(this.props.win);
  }

  render() {
    return (
      <MuiThemeProvider>
        <div className="dofucks">
          <GeneralOptions win={this.props.win}/>
          <Dofucks win={this.props.win}/>
          <Fighter win={this.props.win}/>
          <Harvester win={this.props.win}/>
          <XPer win={this.props.win}/>
          <Seller win={this.props.win}/>
          <Deleter win={this.props.win}/>
          <Sitter win={this.props.win}/>
          <Characteristics win={this.props.win}/>
          <Notifications win={this.props.win}/>
        </div>
      </MuiThemeProvider>
    )
  }
}

export default Bot;
