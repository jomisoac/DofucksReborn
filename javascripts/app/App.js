import React from 'react';
import Chip from 'material-ui/Chip';
import IconButton from 'material-ui/IconButton';
import AddIcon from 'material-ui/svg-icons/action/note-add';
import Game from './Game';
import Bot from '../bot/Bot';
import {blue300} from 'material-ui/styles/colors';
require('../../less/app/tabbar.less');

let nextKey = 1;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 0,
      tabs: {
        0: {key: 0, label: 'N/A', win: null}
      },
      cwin: null
    };
  }

  CharacterSelectedSuccessMessage(e) {
    var label = e.infos.name + " ("+e.infos.level+")";
    var tabs = this.state.tabs;
    var tab = tabs[this.state.selectedTab];
    tab.label = label;
    this.setState({tabs: tabs});
  }

  handleAddTab() {
    var tabs = this.state.tabs;
    var key = nextKey++;
    tabs[key] = {key: key, label: "N/A", win: null};
    this.setState({tabs: tabs});
  }

  handleDeleteTab(key) {
    var tabs = this.state.tabs;
    delete tabs[key];
    this.setState({tabs: tabs});
  }

  handleCreateDocument(key, doc) {
    var tabs = this.state.tabs;
    var cwin = null;
    var tab = this.state.tabs[key];
    if (tab) {
      tab.win = doc;
      tab.win.key = tab.key;
      setTimeout(() => {
        tab.win.dofus.connectionManager.on("CharacterSelectedSuccessMessage", this.CharacterSelectedSuccessMessage.bind(this));
        tab.win.dofus.connectionManager.on("data", (data) => console.log(data));
      }, 1000);
      if (key == 0) {
        cwin = tab.win;
      }
      tabs[key] = tab;
      this.setState(cwin ? {tabs: tabs, cwin: cwin} : {tabs: tabs});
    }
  }

  renderChip(k) {
    let color = k == this.state.selectedTab ? blue300 : '';
    return (
      <Chip
        className="chip"
        backgroundColor={color}
        key={k}
        onTouchTap={() => {
          const t = this.state.tabs[k];
          if (t) {
            this.setState({
              selectedTab: t.key,
              cwin: t.win
            });
            t.win.gui._resizeUi();
          }
        }}
        onRequestDelete={() => {
          if (Object.keys(this.state.tabs).length == 1) {
            alert("Cannot delete remaining tab");
            return;
          }
          this.handleDeleteTab(k);
        }}
      >
        {this.state.tabs[k].label}
      </Chip>
    )
  }

  render() {
    let button = null;
    if (Object.keys(this.state.tabs).length < 8) {
      button = <Chip
        key="+"
        className="chip"
        onTouchTap={this.handleAddTab.bind(this)}
      >
        +
      </Chip>;
    }
    return (
      <div>
        <div className="tabwrapper">
          {Object.keys(this.state.tabs).map(this.renderChip.bind(this), this)}
          {button}
        </div>
        <div className="game">
          {Object.keys(this.state.tabs).map((k) =>
            <div
              key={"div_"+k}
              style={{display: k == this.state.selectedTab ? "block" : "none"}}
            >
              <Game
                key={"Game_"+k}
                tabKey={k}
                onDocumentCreated={this.handleCreateDocument.bind(this)}
              />
              <Bot
                key={"Bot_"+k}
                tabKey={k}
                win={this.state.tabs[k].win}
              />
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default App;
