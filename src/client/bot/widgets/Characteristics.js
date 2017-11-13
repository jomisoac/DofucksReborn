import React from 'react';

import Widget from './Widget';
import Module from '../Module';

import CharacteristicsToUpgrade from '../modules/characteristics/CharacteristicsToUpgrade';

class characteristics extends Module {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Widget title="Characteristics">
        <CharacteristicsToUpgrade win={this.props.win}/>
      </Widget>
    )
  }
}

export default characteristics;
