import React from 'react';

import ItemSearcher from '../../util/ItemSearcher';

class ItemsToDelete extends React.Component {
  constructor(props) {
    super(props)
  }

  setItems(items) {
    this.props.win.Dofucks.Deleter.wantToDelete = items;
  }

  render() {
    return (
      <ItemSearcher win={this.props.win} tag="deleter_items_to_delete" setItems={this.setItems.bind(this)}/>
    );
  }
}

export default ItemsToDelete;
