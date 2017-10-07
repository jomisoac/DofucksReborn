import React from 'react';

import Module from '../Module';
import Toggle from 'material-ui/Toggle';
import {ListItem} from 'material-ui/List';

class AutoFollower extends Module {
  constructor(props) {
    super(props);
    this.tag = "auto_follower";
    this.state._[this.tag] = false;
    this.state.isDisabled = false;
  }

  ready() {
    /*setInterval(() => {
      this.setState({isDisabled: !!this.props.win.Dofucks.Farmer.isActivated()});
    }, 2000);*/
  }

  start() {
    console.debug("[AUTO_FOLLOWER] started");
    this.props.win.Dofucks.Follower.enabled = true;
    this.setValue(true);
  }

  stop() {
    console.debug("[AUTO_FOLLOWER] stopped");
    this.props.win.Dofucks.Follower.enabled = false;
    this.setValue(false);
  }

  onLoaded(data) {
    if (data) {
      this.start();
      return true;
    }
    return false;
  }

  onToggle(e, v) {
    if (v) {
      this.start();
    } else {
      this.stop();
    }
  }

  render() {
    return (
      <ListItem
        primaryText="Follow party member"
        rightToggle={<Toggle disabled={this.state.isDisabled} onToggle={this.onToggle.bind(this)} toggled={this.state._[this.tag]}/>}
      />
    )
  }
}

export default AutoFollower;
