import React from 'react';

import Widget from './Widget';
import Module from '../Module';

import FpsManager from '../modules/options/FpsManager';

class GeneralOptions extends Module {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Widget title="General Options">
        <FpsManager win={this.props.win}/>
      </Widget>
    )
  }
}

export default GeneralOptions;
