import React from 'react';

import Widget from './Widget';
import Module from '../Module';

import ItemsToDelete from '../modules/deleter/ItemsToDelete';

class Deleter extends Module {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Widget title="Deleter">
        <ItemsToDelete win={this.props.win}/>
      </Widget>
    )
  }
}

export default Deleter;
