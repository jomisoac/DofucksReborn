import React from 'react';
import {ListItem} from 'material-ui/List';
import Toggle from 'material-ui/Toggle';
import Slider from 'material-ui/Slider';

import Module from '../Module';
import Mover from '../util/Mover';

class SpeedHack extends Module {
  constructor(props) {
    super(props);
    this.tag = "speedhack";
    this.state._[this.tag] = {
      amount: 50,
      enabled: false
    }
  }

  ready() {
    this.props.win.isoEngine.on("mapLoaded", this.mapLoaded.bind(this));
  }

  start() {
    console.debug("[SPEEDHACK] started");
		this.props.win.isoEngine.actorManager.userActor.speedAdjust = this.state._[this.tag].amount;
    this.setOptionValue("enabled", true);
  }

  stop() {
    console.debug("[SPEEDHACK] stopped");
    this.props.win.isoEngine.actorManager.userActor.speedAdjust = 8;
    this.setOptionValue("enabled", false);
  }

  mapLoaded(e) {
    if (this.state._[this.tag].enabled) {
	    this.props.win.isoEngine.actorManager.userActor.speedAdjust = this.state._[this.tag].amount;
    }
  }

  onToggle(e, isChecked) {
    if (isChecked) {
      this.start();
    } else {
      this.stop();
    }
  }

  onLoaded(data, state) {
    if (data.enabled) {
      this.start();
      state.enabled = true;
    }
    state.amount = data.amount;
    return state;
  }

  handleSlider(e, v) {
    if (this.state._[this.tag].enabled) {
      this.props.win.isoEngine.actorManager.userActor.speedAdjust = v;
    }
    this.setOptionValue('amount', v);
  }

  render() {
    return (
      <div>
        <ListItem
          primaryText={"Speedhack ("+this.state._[this.tag].amount+")"}
          rightToggle={<Toggle onToggle={this.onToggle.bind(this)} toggled={this.state._[this.tag].enabled} />}
        />
        <Slider
          min={1}
          max={500}
          step={1}
          defaultValue={5}
          value={this.state._[this.tag].amount}
          onChange={this.handleSlider.bind(this)}
          style={{margin: "0 10px"}}
        />
      </div>
    )
  }
}

export default SpeedHack;
