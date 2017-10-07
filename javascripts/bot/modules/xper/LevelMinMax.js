import React from 'react';

import Module from '../../Module';
import Toggle from 'material-ui/Toggle';
import {ListItem} from 'material-ui/List';
import TextField from 'material-ui/TextField';
import { Grid, Row, Cell } from 'react-inline-grid';

class LevelMinMax extends Module {
  constructor(props) {
    super(props);
    this.tag = "xper_lvls";
    this.state._[this.tag] = {
      min: 0,
      max: 30
    };
  }

  onMinValueChange(ev, v) {
    var value = parseInt(v);
    this.props.win.Dofucks.Farmer.XPer.minLvl = value;
    this.setOptionValue("min", value);
  }

  onMaxValueChange(ev, v) {
    var value = parseInt(v);
    this.props.win.Dofucks.Farmer.XPer.maxLvl = value;
    this.setOptionValue("max", value);
  }

  onLoaded(data) {
    if (data.max) {
      this.props.win.Dofucks.Farmer.XPer.minLvl = data.min;
      this.props.win.Dofucks.Farmer.XPer.maxLvl = data.max;
    }
    return data;
  }

  render() {
    return (
      <Grid>
        <Row is="nospace">
          <Cell is="6">
            <TextField
              floatingLabelText="Minimum level"
              floatingLabelFixed={true}
              fullWidth={true}
              value={this.state._[this.tag].min}
              onChange={this.onMinValueChange.bind(this)}
            />
          </Cell>
          <Cell is="6">
            <TextField
              floatingLabelText="Maximum level"
              floatingLabelFixed={true}
              fullWidth={true}
              value={this.state._[this.tag].max}
              onChange={this.onMaxValueChange.bind(this)}
            />
          </Cell>
        </Row>
      </Grid>
    )
  }
}

export default LevelMinMax;
