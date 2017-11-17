import React from 'react';

import Module from '../../Module';
import MonsterChoserCondition from '../util/MonsterSearcher/MonsterChoserCondition';
import AutoComplete from 'material-ui/AutoComplete';
import { Grid, Row, Cell } from 'react-inline-grid';

import MonsterConditionDialog from '../util/xper/MonsterConditionDialog';
import {MonsterCondition} from '../../util/XPer/MonsterConditions';

import axios from 'axios';

class MonsterChoser extends Module {
  constructor(props) {
    super(props);
    this.tag = "xper_monster_conditions";
    this.state._[this.tag] = [];
    this.state.searchText = '';
    this.state.monsters = [];
    this.state.tmpMonster = null;
  }

  onLoaded(data) {
    if (data) {
      console.log(data != undefined ? typeof data[0] : "coucou");
      data = data.filter((e) => {
        return typeof e == "object"
      })
      var monsterConditions = data.map(e => new MonsterCondition(e.mobId, e.condition, e.count));
      this.setMonsterConditions(monsterConditions);
    }
    return data;
  }

  fetchMonsters() {
    if (this.state.searchText.length < 3) return;
    axios.get('http://dofucks.com:8000/search/monsters?q='+this.state.searchText+'&l='+this.props.win.Config.language)
    .then(r => {
      var monsters = [];
      r.data.forEach((e, i) => {
        monsters.push({text: e.nameId, value: e.id, gfxId: e.gfxId});
      })
      this.setState({monsters: monsters});
    });
  }

  handleUpdateInput(searchText) {
    this.setState({
      searchText: searchText,
    }, () => {
      this.fetchMonsters();
    });
  }

  onMonsterClick(mc) {
    var tmp = this.state._[this.tag].slice();
    var index = tmp.findIndex(c => c.mobId == mc.mobId && c.condition == mc.condition && c.count == mc.count)
    if (index !== -1) {
      tmp.splice(index, 1);
    }
    this.setMonsterConditions(tmp);
  }

  handleNewRequest(monster) {
    this.setState({tmpMonster: monster});
  }

  onMonsterConditionDialogClose() {
    this.setState({tmpMonster: null});
  }

  onMonsterConditionDialogAdd(id, cond, count) {
    var monsterCondition = new MonsterCondition(id, cond, count);
    var tmp = this.state._[this.tag];
    tmp.push(monsterCondition);
    this.setMonsterConditions(tmp);
    this.resetAll();
  }

  setMonsterConditions(conditions) {
    this.setValue(conditions);
    this.props.win.Dofucks.Farmer.XPer.monsterConditions.conditions = conditions;
  }

  resetAll() {
    this.setState({
      searchText: '',
      tmpMonster: null,
      monsters: []
    })
  }

  render() {
    return (
      <div>
        <AutoComplete
          hintText="Type the name of a monster"
          searchText={this.state.searchText}
          onUpdateInput={this.handleUpdateInput.bind(this)}
          onNewRequest={this.handleNewRequest.bind(this)}
          dataSource={this.state.monsters}
          filter={(searchText, key) => (key.toLowerCase().indexOf(searchText.toLowerCase()) !== -1)}
          openOnFocus={true}
          fullWidth={true}
        />
        {
          this.state.tmpMonster && <MonsterConditionDialog
            onMonsterConditionDialogClose={this.onMonsterConditionDialogClose.bind(this)}
            onMonsterConditionDialogAdd={this.onMonsterConditionDialogAdd.bind(this)}
            tmpMonster={this.state.tmpMonster}
          />
        }
        <Grid>
          <Row is="nospace">
            {
              this.state._[this.tag].map((e, i) => {
                return (
                  <MonsterChoserCondition key={i} monster={e} onClick={this.onMonsterClick.bind(this)}/>
                )
              })
            }
          </Row>
        </Grid>
    </div>
    )
  }
}

export default MonsterChoser;
