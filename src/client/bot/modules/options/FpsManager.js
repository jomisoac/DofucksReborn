import React from 'react';

import Module from '../../Module';

import TextField from 'material-ui/TextField';

class FpsManager extends Module {
  constructor(props) {
    super(props);
    this.tag = "options_fps";
    this.state._[this.tag] = 25;
  }

  ready() {
  }

  onLoaded(data) {
    if (data) {
      this.setFps(data);
    }
    return data;
  }

  onFpsChange(e, fps) {
    var f = parseInt(fps);
    this.setValue(fps);
    if (f < 1 || f > 60 || !f) {
      this.setState({error: "FPS must be between 1 and 60"})
      return;
    } else {
      this.setState({error: false});
    }
    this.setFps(fps);
  }

  setFps(fps) {
    this.props.win.Dofucks.FpsManipulator.setFps(fps);
  }

  render() {
    return (
      <div>
        <TextField
          floatingLabelText="FPS"
          floatingLabelFixed={true}
          fullWidth={true}
          errorText={this.state.error}
          value={this.state._[this.tag]}
          onChange={this.onFpsChange.bind(this)}
        />
      </div>
    );
  }
}

export default FpsManager;
