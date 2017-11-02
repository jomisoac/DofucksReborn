import React from 'react';

class Module extends React.Component {
  ready() {}
  onLoaded(data) {return data;}

  componentDidMount() {
    if (this.props.win && this.props.win.document.readyState == "complete") {
      this.profileData = {};
      this.ready();
      this.props.win.dofus.connectionManager.on('CharacterSelectedSuccessMessage', this.CharacterSelectedSuccessMessage.bind(this));
    } else {
      setTimeout(() => {
        this.componentDidMount();
      }, 100);
    }
  }

  constructor(props) {
    super(props);
    this.tag = "";
    this.state = {
      _: {}
    };
  }

  CharacterSelectedSuccessMessage(e) {
    this.characterName = e.infos.name;
    this.characterId = e.infos.id;
    var key = this.characterName+"_"+this.characterId;
    this.profileData = this.loadProfile('dfks_'+key);
    //console.debug("Load profile");
    this.onLoad(this.profileData);
  }

  loadProfile(key) {
    if ("localStorage" in this.props.win) {
			try {
				var profile = this.props.win.localStorage.getItem(key);
				if (!profile) {
          profile = "{}";
				}
				return JSON.parse(profile);
			} catch (e) {
				console.error(e);
				return {};
			}
		}
  }

  onLoad(data) {
    if (data[this.tag] === undefined) {
      this.save();
    } else {
      if (data[this.tag]) {
        var d = this.onLoaded(data[this.tag], this.state._[this.tag]);
        var savable = {};
        savable[this.tag] = d;
        this.setState({
          _: savable
        });
      }
    }
  }

  save() {
    var data = this.state._;
    var key = this.characterName+"_"+this.characterId;
    this.profileData = this.loadProfile('dfks_'+key);
    for (var k in data) {
      this.profileData[k] = data[k];
    }
    if ("localStorage" in this.props.win) {
      var stringified = JSON.stringify(this.profileData);
      this.props.win.localStorage.setItem('dfks_'+key, stringified);
    }
  }

  setOptionValue(option, value) {
    var opt = this.state._[this.tag];
    opt[option] = value;
    var savable = this.getSavableObject(opt);
    this.setState(savable, () => {
      this.save();
    });
  }

  setValue(value) {
    var savable = this.getSavableObject(value);
    this.setState(savable, () => {
      this.save();
    });
  }

  getSavableObject(v) {
    var withTag = {};
    withTag[this.tag] = v;
    var savable = {
      _: withTag
    };
    return savable;
  }
}


export default Module;
