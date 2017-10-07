import React from 'react';

import Module from '../../Module';
import TextField from 'material-ui/TextField';

class ItemsToDelete extends Module {
  constructor(props) {
    super(props),
    this.tag = "deleter_items_to_delete";
    this.state._[this.tag] = [];
    this.state.value = '';
  }

  ready() {
  }

  setItemsToDelete(v) {
    this.props.win.Dofucks.Deleter.wantToDelete = v;
  }

  onLoaded(data) {
    if (data) {
      this.setItemsToDelete(data);
      this.setState({
        value: data.toString()
      });
    }
    return data;
  }

  handleChange(event, nv) {
    var v = this.props.win.Dofucks.Utils.getCommaSeparatedNumbers(nv);
    if (nv && nv[nv.length - 1] !== ',') {
      this.setState({
        value: v.toString()
      });
      this.setValue(v);
      this.setItemsToDelete(v);
    } else {
      this.setState({
        value: nv
      });
    }
  };

  render() {
    return (
      <TextField
        floatingLabelText="Items to delete"
        floatingLabelFixed={true}
        hintText="1,2,3"
        value={this.state.value}
        onChange={this.handleChange.bind(this)}
        fullWidth={true}
        multiLine={true}
        rowsMax={5}
      />
    );
  }
}

export default ItemsToDelete;
