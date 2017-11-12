import React from 'react';

import ItemSearcher from '../../util/ItemSearcher';

class ItemsToSell extends React.Component {
  constructor(props) {
    super(props)
  }

  setItems(items) {
    this.props.win.Dofucks.Seller.wantToSell = items;
  }

  render() {
    return (
      <ItemSearcher win={this.props.win} tag="seller_items_to_sell" setItems={this.setItems.bind(this)}/>
    );
  }
}

export default ItemsToSell;
