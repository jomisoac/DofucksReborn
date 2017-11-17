import React from 'react';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';

class MonsterConditionDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      cbv: '>',
      error: false
    };
  }

  handleChangeValue(e, v) {
    var val = parseInt(v);
    if (isNaN(val)) {
      this.setState({error: "This must be a number."})
    } else if (val > 8 || val < 0) {
      this.setState({error: "This must be a number between 0 and 8."})
    } else {
      this.setState({error: false})
    }
    this.setState({
      value: v,
    });
  };

  handleChangeCombo(e, i, v) {
    this.setState({cbv: v});
  }

  onAdd() {
    if (this.state.error) return;
    this.props.onMonsterConditionDialogAdd(this.props.tmpMonster.value, this.state.cbv, this.state.value);
  }

  render() {
    const actions = [
      <FlatButton
        label="CANCEL"
        primary={true}
        onClick={this.props.onMonsterConditionDialogClose}
      />,
      <FlatButton
        label="ADD"
        primary={true}
        keyboardFocused={true}
        onClick={this.onAdd.bind(this)}
      />,
    ];
    return (
      <Dialog
        title="Add a monster condition"
        actions={actions}
        open={true}
        onRequestClose={this.props.onMonsterConditionDialogClose}>
        <span>I want the number of</span>
        <img src={"https://ankama.akamaized.net/games/dofus-tablette/assets/2.17.3/gfx/monsters/"+this.props.tmpMonster.value+".png"}
          style={{marginBottom: -30}}/>
        <span>to be</span>
        <span>
          <DropDownMenu value={this.state.cbv} onChange={this.handleChangeCombo.bind(this)}
            style={{bottom: -20}}>
            <MenuItem value={'>'} primaryText="Superior than" />
            <MenuItem value={'<'} primaryText="Inferior than" />
            <MenuItem value={'='} primaryText="Equal to" />
          </DropDownMenu>
          <TextField
            hintText="Value (0-8)"
            value={this.state.value}
            onChange={this.handleChangeValue.bind(this)}
            errorText={this.state.error}
          />
        </span>
      </Dialog>
    )
  }
}

export default MonsterConditionDialog;
