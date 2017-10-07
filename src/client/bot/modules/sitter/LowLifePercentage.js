import React from 'react';

import Module from '../../Module';
import Slider from 'material-ui/Slider';
import Subheader from 'material-ui/Subheader';
import { Grid, Row, Cell } from 'react-inline-grid';

class LowLifePercentage extends Module {
  constructor(props) {
    super(props);
    this.tag = "sitter_llp";
    this.state._[this.tag] = 50;
  }

  handleSlider(e, v) {
    this.props.win.Dofucks.Sitter.lowLifePercentage = v;
    this.setValue(v);
  }

  onLoaded(data) {
    if (data) {
      this.props.win.Dofucks.Sitter.lowLifePercentage = data;
    }
    return data;
  }

  render() {
    return (
      <div>
        <Subheader>Low life % - {this.state._[this.tag]}%</Subheader>
        <Slider
          min={1}
          max={99}
          step={1}
          defaultValue={this.state._[this.tag]}
          value={this.state._[this.tag]}
          onChange={this.handleSlider.bind(this)}
        />
      </div>
    )
  }
}

export default LowLifePercentage;
