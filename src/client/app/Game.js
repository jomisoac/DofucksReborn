import React from 'react';
import ReactDOM from 'react-dom';

import {iframe} from './iframe';

class Game extends React.Component {
  componentDidMount() {
    const doc = ReactDOM.findDOMNode(this).contentWindow;
    this.props.onDocumentCreated(this.props.tabKey, doc);
  }

  render() {
    return (
      <iframe src={"./game.html?appVersion=1.10.1"} style={iframe}/>
    )
  }
}

export default Game;
