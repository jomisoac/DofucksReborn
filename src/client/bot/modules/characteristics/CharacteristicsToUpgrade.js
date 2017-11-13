import React from 'react';

import Module from '../../Module';

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Subheader from 'material-ui/Subheader';

class CharacteristicsToUpgrade extends Module {
  constructor(props) {
    super(props);
    this.tag = "characteristics_upgrade";
    this.state._[this.tag] = null;
  }

  ready() {
    setTimeout(() => {
      this.setState({availableUpgrades: this.props.win.Dofucks.CharacteristicsUpgrader.availableUpgrades});
    }, 1000);
  }

  onLoaded(data) {
    this.props.win.Dofucks.CharacteristicsUpgrader.toUpgrade = data;
    return data;
  }

  handleChange(e, n, v) {
    this.setValue(e ? v : null);
    this.setUpgradableCharacteristic(v);
  }

  setUpgradableCharacteristic(ch) {
    this.props.win.Dofucks.CharacteristicsUpgrader.toUpgrade = ch;
  }

  render() {
    return (
      <div>
        <Subheader>Auto upgrade:</Subheader>
        <DropDownMenu autoWidth={false} value={this.state._[this.tag]} onChange={this.handleChange.bind(this)} style={{width: "100%"}}>
          <MenuItem value={null} primaryText="Nothing" />
          {
            this.state.availableUpgrades && this.state.availableUpgrades.map((e, i) => {
              return <MenuItem key={i} value={e} primaryText={e[0].toUpperCase()+e.substr(1)} />
            })
          }
        </DropDownMenu>
      </div>
    );
  }
}

export default CharacteristicsToUpgrade;
