import React from 'react';

import Widget from './Widget';
import Module from '../Module';

import LowLifePercentage from '../modules/sitter/LowLifePercentage';

class Sitter extends Module {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Widget title="Sitter">
        <LowLifePercentage win={this.props.win} />
      </Widget>
    )
  }
}

export default Sitter;
