import React from 'react';

import Module from '../../Module';
import Toggle from 'material-ui/Toggle';
import {ListItem} from 'material-ui/List';

class SellByTen extends Module {
  constructor(props) {
    super(props),
    this.tag = "seller_sell_by_10";
    this.state._[this.tag] = false;
  }

  ready() {
  }

  onActivate() {
    console.debug("[SELL/10] activated");
    this.props.win.Dofucks.Seller.canSellByTen = true;
    this.setValue(true);
  }

  onDeactivate() {
    console.debug("[SELL/10] deactivated");
    this.props.win.Dofucks.Seller.canSellByTen = false;
    this.setValue(false);
  }

  onLoaded(data) {
    if (data) {
      this.onActivate();
    }
    return data;
  }

  onToggle(e, isChecked) {
    if (isChecked) {
      this.onActivate();
    } else {
      this.onDeactivate();
    }
  }

  render() {
    return (
      <ListItem
        primaryText="Allow sell/10"
        rightToggle={<Toggle onToggle={this.onToggle.bind(this)} toggled={this.state._[this.tag]}/>}
      />
    );
  }
}

export default SellByTen;
