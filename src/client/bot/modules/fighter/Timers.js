import React from 'react';

import Module from '../../Module';

import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import { Grid, Row, Cell } from 'react-inline-grid';

class Timers extends Module {

  ready() {
    setTimeout(() => {
      var obj = {};
      obj[this.tag] =  {
        castSpellMin: this.props.win.Dofucks.Fighter.castSpellMin,
        castSpellMax: this.props.win.Dofucks.Fighter.castSpellMax,
        actionMin: this.props.win.Dofucks.Fighter.actionMin,
        actionMax: this.props.win.Dofucks.Fighter.actionMax,
        finishTurnMin: this.props.win.Dofucks.Fighter.finishTurnMin,
        finishTurnMax: this.props.win.Dofucks.Fighter.finishTurnMax,
      };
      this.setState({
        _: obj
      })
    }, 1000);
  }

  onLoaded(data) {
    return {
      castSpellMin: data.castSpellMin,
      castSpellMax: data.castSpellMax,
      actionMin: data.actionMin,
      actionMax: data.actionMax,
      finishTurnMin: data.finishTurnMin,
      finishTurnMax: data.finishTurnMax
    };
  }

  constructor(props) {
    super(props);
    this.tag = "fighter_timers";
    this.state["open"] = false;
    this.state._[this.tag] = {
        castSpellMin: 0,
        castSpellMax: 0,
        actionMin: 0,
        actionMax: 0,
        finishTurnMin: 0,
        finishTurnMax: 0
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

  handleTBCSMinChange(e, v) {
    var value = this.getIntVal(v);
    this.setOptionValue("castSpellMin", value);
    this.props.win.Dofucks.Fighter.castSpellMin = value;
  }

  handleTBCSMaxChange(e, v) {
    var value = this.getIntVal(v);
    this.setOptionValue("castSpellMax", value);
    this.props.win.Dofucks.Fighter.castSpellMax = value;
  }

  handleTACSMinChange(e, v) {
    var value = this.getIntVal(v);
    this.setOptionValue("actionMin", value);
    this.props.win.Dofucks.Fighter.actionMin = value;
  }

  handleTACSMaxChange(e, v) {
    var value = this.getIntVal(v);
    this.setOptionValue("actionMax", value);
    this.props.win.Dofucks.Fighter.actionMax = value;
  }

  handleTBPTMinChange(e, v) {
    var value = this.getIntVal(v);
    this.setOptionValue("finishTurnMin", value);
    this.props.win.Dofucks.Fighter.finishTurnMin = value;
  }

  handleTBPTMaxChange(e, v) {
    var value = this.getIntVal(v);
    this.setOptionValue("finishTurnMax", value);
    this.props.win.Dofucks.Fighter.finishTurnMax = value;
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
        <RaisedButton label="TIMERS OPTIONS" primary={true} fullWidth={true} onTouchTap={this.handleOpen.bind(this)}/>
        <Dialog
            title="Fight timers options"
            actions={actions}
            modal={false}
            open={this.state.open}
            onRequestClose={this.handleClose.bind(this)}
          >
            <Grid>
              <Row>
                <Cell is="6">
                  <TextField fullWidth={true} floatingLabelText="Time before casting spell (min)"
                    floatingLabelFixed={true} value={this.state._.fighter_timers.castSpellMin}
                     onChange={this.handleTBCSMinChange.bind(this)} />
                </Cell>
                <Cell is="6">
                  <TextField fullWidth={true} floatingLabelText="Time before casting spell (max)"
                    floatingLabelFixed={true} value={this.state._.fighter_timers.castSpellMax}
                     onChange={this.handleTBCSMaxChange.bind(this)} />
                </Cell>
                <Cell is="6">
                  <TextField fullWidth={true} floatingLabelText="Time after casting spell (min)"
                    floatingLabelFixed={true} value={this.state._.fighter_timers.actionMin}
                     onChange={this.handleTACSMinChange.bind(this)} />
                </Cell>
                <Cell is="6">
                  <TextField fullWidth={true} floatingLabelText="Time after casting spell (max)"
                    floatingLabelFixed={true} value={this.state._.fighter_timers.actionMax}
                     onChange={this.handleTACSMaxChange.bind(this)} />
                </Cell>
                <Cell is="6">
                  <TextField fullWidth={true} floatingLabelText="Time before passing turn (min)"
                    floatingLabelFixed={true} value={this.state._.fighter_timers.finishTurnMin}
                     onChange={this.handleTBPTMinChange.bind(this)} />
                </Cell>
                <Cell is="6">
                  <TextField fullWidth={true} floatingLabelText="Time before passing turn (max)"
                    floatingLabelFixed={true} value={this.state._.fighter_timers.finishTurnMax}
                     onChange={this.handleTBPTMaxChange.bind(this)} />
                </Cell>
              </Row>
            </Grid>
        </Dialog>
      </div>
    );
  }
}

export default Timers;
