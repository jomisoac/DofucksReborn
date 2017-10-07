import React from 'react';

import Module from '../../Module';

import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import { Grid, Row, Cell } from 'react-inline-grid';

class Priorities extends Module {

  ready() {
    setTimeout(() => {
      var obj = {};
      obj[this.tag] =  {
        allyRatio: this.props.win.Dofucks.Fighter.allyRatio,
        boostRatio: this.props.win.Dofucks.Fighter.boostRatio,
        summonRatio: this.props.win.Dofucks.Fighter.summonRatio,
        killRatio: this.props.win.Dofucks.Fighter.killRatio
      };
      this.setState({
        _: obj
      })
    }, 1000);
  }

  onLoaded(data) {
    return {
      allyRatio: data.allyRatio,
      boostRatio: data.boostRatio,
      summonRatio: data.summonRatio,
      killRatio: data.killRatio
    };
  }

  constructor(props) {
    super(props);
    this.tag = "fighter_priorities";
    this.state["open"] = false;
    this.state._[this.tag] = {
        allyRatio: 0,
        boostRatio: 0,
        summonRatio: 0,
        killRatio: 0
    };
  }

  handleOpen() {
    this.setState({open: true});
  };

  handleClose() {
    this.setState({open: false});
  };

  getIntVal(v) {
    var nv = parseInt(v);
    return isNaN(nv) ? 0 : nv;
  }

  handleAllyRatioChange(e, v) {
    var value = this.getIntVal(v);
    this.setOptionValue("allyRatio", value);
    this.props.win.Dofucks.Fighter.allyRatio = value;
  }

  handleBoostRatioChange(e, v) {
    var value = this.getIntVal(v);
    this.setOptionValue("boostRatio", value);
    this.props.win.Dofucks.Fighter.boostRatio = value;
  }

  handleSummonRatioChange(e, v) {
    var value = this.getIntVal(v);
    this.setOptionValue("summonRatio", value);
    this.props.win.Dofucks.Fighter.summonRatio = value;
  }

  handleKillRatioChange(e, v) {
    var value = this.getIntVal(v);
    this.setOptionValue("killRatio", value);
    this.props.win.Dofucks.Fighter.killRatio = value;
  }

  render() {
    const actions = [
      <FlatButton
        label="OK"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleClose.bind(this)}
      />,
    ];
    return (
      <div>
        <RaisedButton label="PRIORITIES OPTIONS" secondary={true} fullWidth={true} onTouchTap={this.handleOpen.bind(this)}/>
        <Dialog
            title="Priorities options"
            actions={actions}
            modal={false}
            open={this.state.open}
            onRequestClose={this.handleClose.bind(this)}
          >
            All ratios are stackable, they are set for only one unit.
            <Grid>
              <Row>
                <Cell is="6">
                  <TextField fullWidth={true} floatingLabelText="Remove ratio when a single ally is hit"
                    floatingLabelFixed={true} value={this.state._.fighter_priorities.allyRatio}
                     onChange={this.handleAllyRatioChange.bind(this)} />
                </Cell>
                <Cell is="6">
                  <TextField fullWidth={true} floatingLabelText="Add ratio on boost spells"
                    floatingLabelFixed={true} value={this.state._.fighter_priorities.boostRatio}
                     onChange={this.handleBoostRatioChange.bind(this)} />
                </Cell>
                <Cell is="6">
                  <TextField fullWidth={true} floatingLabelText="Add ratio on summon spells"
                    floatingLabelFixed={true} value={this.state._.fighter_priorities.summonRatio}
                     onChange={this.handleSummonRatioChange.bind(this)} />
                </Cell>
                <Cell is="6">
                  <TextField fullWidth={true} floatingLabelText="Add ratio when an ennemy can be killed"
                    floatingLabelFixed={true} value={this.state._.fighter_priorities.killRatio}
                     onChange={this.handleKillRatioChange.bind(this)} />
                </Cell>
              </Row>
            </Grid>
        </Dialog>
      </div>
    );
  }
}

export default Priorities;
