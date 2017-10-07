import React from 'react';

import Module from '../../Module';
import Subheader from 'material-ui/Subheader';

class KamasInBank extends Module {
  constructor(props) {
    super(props),
    this.tag = "seller_kamas_in_bank";
    this.state._[this.tag] = 0;
  }

  ready() {
    this.props.win.dofus.connectionManager.on('TextInformationMessage', this.TextInformationMessage.bind(this));
    this.props.win.dofus.connectionManager.on('StorageKamasUpdateMessage', this.StorageKamasUpdateMessage.bind(this));
  }

  getReadableValue() {
    return this.state._[this.tag].toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1.");
  }

  TextInformationMessage(e) {
    if (/^Banque : \+ /.test(e.text)) {
      this.setValue(this.state._[this.tag] + parseInt(e.text.match(/[0-9]+/)[0]));
    }
  }

  StorageKamasUpdateMessage(e) {
    this.setValue(e.kamasTotal);
  }

  render() {
    return (
      <Subheader>{this.getReadableValue()} Kamas in bank</Subheader>
    );
  }
}

export default KamasInBank;
