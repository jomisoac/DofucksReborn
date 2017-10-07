import React from 'react';
import Module from '../../Module';

import Jobs from '../../db/Jobs';
import Skills from '../../db/Skills';
import Interactives from '../../db/Interactives';
import Items from '../../db/Items';

import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';
import Dialog from 'material-ui/Dialog';
import {List, ListItem} from 'material-ui/List';

import Checked from 'material-ui/svg-icons/device/gps-fixed';
import Unchecked from 'material-ui/svg-icons/device/gps-off';

class ResourceChoser extends Module {
  constructor(props) {
    super(props);
    this.harvestJobs = [2, 24, 26, 28, 36];
    this.tag = "harvester_items";
    this.state._[this.tag] = [];
    this.state.open = false;
  }

  handleOpen() {
    this.setState({open: true});
  }

  handleClose() {
    this.setState({open: false});
  }

  renderJobs() {
    var jobs = [];
    for (var i in Jobs) {
      var job = Jobs[i];
      if (this.harvestJobs.indexOf(job.id) != -1) {
        var items = this.renderItems(job.id);
        jobs.push(
          <ListItem primaryText={job.nameId}
            leftIcon={<img src={"http://dl.ak.ankama.com/games/dofus-tablette/assets/2.15.15/gfx/jobs/"+job.iconId+".png"}/>}
            nestedItems={items}
            initiallyOpen={true}
            key={"job-"+job.id}
          />
        )
      }
    }
    return jobs;
  }

  renderItems(jobId) {
    var items = [];
    for (var i in Skills) {
      var skill = Skills[i];
      if (skill.gatheredRessourceItem != -1 && skill.parentJobId == jobId) {
        items.push(
          <ListItem primaryText={Interactives[skill.interactiveId].nameId}
            leftIcon={<img src={"http://dl.ak.ankama.com/games/dofus-tablette/assets/2.15.15/gfx/items/"+Items[skill.gatheredRessourceItem].iconId+".png"}/>}
            key={"job-"+skill.parentJobId+"-item-"+skill.gatheredRessourceItem+"-skill"+skill.id}
            rightToggle={
              <Checkbox
                checked={this.state._[this.tag].indexOf(skill.id) != -1}
                checkedIcon={<Checked />}
                uncheckedIcon={<Unchecked />}
                onCheck={this.onItemCheck.bind(this)}
                data-id={skill.id}
              />
              }
          />
        )
      }
    }
    return items;
  }

  onLoaded(data) {
    this.props.win.Dofucks.Farmer.Harvester.useSkills = data;
    return data;
  }

  onItemCheck(ev, isChecked) {
    var id = parseInt(ev.target.dataset.id);
    var items = this.state._[this.tag];
    var index = items.indexOf(id);
    if (isChecked) {
      if (index == -1) {
        items.push(id);
      }
    } else {
      if (index != -1) {
        items.splice(index, 1);
      }
    }
    this.props.win.Dofucks.Farmer.Harvester.useSkills = items;
    this.setValue(items);
  }

  render() {
    const actions = null;
    return (
      <div>
        <RaisedButton label="HARVEST OPTIONS" primary={true} fullWidth={true} onTouchTap={this.handleOpen.bind(this)}/>
        <Dialog
            title="Harvester options"
            actions={actions}
            modal={false}
            open={this.state.open}
            onRequestClose={this.handleClose.bind(this)}
            autoScrollBodyContent={true}
            bodyStyle={{height: "90vh"}}
          >
            <List>
              {this.renderJobs()}
            </List>
        </Dialog>
      </div>
    );
  }
}

export default ResourceChoser;
