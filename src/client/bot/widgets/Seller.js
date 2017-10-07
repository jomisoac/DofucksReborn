import React from 'react';

import Widget from './Widget';
import Module from '../Module';

import {List} from 'material-ui/List';
import SellByTen from '../modules/seller/SellByTen';
import ItemsToSell from '../modules/seller/ItemsToSell';
import KamasInBank from '../modules/seller/KamasInBank';

class Seller extends Module {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Widget title="Seller">
        <KamasInBank win={this.props.win}/>
        <List>
          <SellByTen win={this.props.win}/>
        </List>
        <ItemsToSell win={this.props.win}/>
      </Widget>
    )
  }
}

export default Seller;
