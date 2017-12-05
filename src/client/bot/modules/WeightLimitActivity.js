import React from 'react';

import Module from '../Module';

import Slider from 'material-ui/Slider';
import Subheader from 'material-ui/Subheader';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import { Grid, Row, Cell } from 'react-inline-grid';

class WeightLimitActivity extends Module {

  ready() {
    this.props.win.dofus.connectionManager.on('InventoryWeightMessage', this.InventoryWeightMessage.bind(this))
  }

  constructor(props) {
    super(props);
    this.tag = "weight_limit";
    this.state._[this.tag] = {
      limit: 850
    };
    this.state.weight = 0;
    this.state.maxWeight = 1000;
  }

  onLoaded(data) {
    if (data.limit > this.state.maxWeight) {
      this.setState({
        maxWeight: data.limit
      });
    }
    return data;
  }

  InventoryWeightMessage(e) {
    var maxWeight = e.weightMax;
    var weight = e.weight;
    this.props.win.Dofucks.weightLimitPercentage = (this.state._[this.tag].limit * 100 / maxWeight);
    this.setState({
      maxWeight: maxWeight,
      weight: weight
    });
    if (weight >= this.state._[this.tag].limit && !this.props.win.Dofucks.isLocked) {
      this.props.win.Dofucks.Deleter.deleteThen(null, (hasDeleted) => {
        if (!hasDeleted) {
          this.props.win.Dofucks.Seller.sellThen(() => {
            this.props.win.Dofucks.Farmer.process();
          });
        }
      })
    }
  }

  handleSlider(e, v) {
    this.props.win.Dofucks.weightLimitPercentage = (v * 100 / this.state.maxWeight);
    this.setOptionValue('limit', v);
  }

  render() {
    return (
      <div style={{height: 125}}>
        <Subheader>Weight limit before selling</Subheader>
        <Grid>
          <Row is="nospace">
            <Cell is="8">
              <Slider
                min={250}
                max={this.state.maxWeight}
                step={10}
                defaultValue={this.state._[this.tag].limit}
                value={this.state._[this.tag].limit}
                onChange={this.handleSlider.bind(this)}
              />
            </Cell>
            <Cell is="4"><Subheader>{this.state._[this.tag].limit} pods</Subheader></Cell>
          </Row>
        </Grid>
      </div>
    )
  }
}

export default WeightLimitActivity;
