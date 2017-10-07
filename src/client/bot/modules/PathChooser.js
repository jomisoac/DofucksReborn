import React from 'react';

import Module from '../Module';
import FlatButton from 'material-ui/FlatButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import { Grid, Row, Cell } from 'react-inline-grid';

const uploadInputStyle = {
  cursor: 'pointer',
  position: 'absolute',
  top: 0,
  bottom: 0,
  right: 0,
  left: 0,
  width: '100%',
  height: '100%',
  opacity: 0
}

class PathChooser extends Module {
  constructor(props) {
    super(props);
    this.tag = "path_chooser";
    this.state._[this.tag] = {
      value: 0,
      paths: []
    }
  }

  ready() {
  }

  onPathChosen(e, k, v) {
    console.debug("[PATH CHOOSER] Path chosen : "+v, this.state._[this.tag].paths[v].path);
    this.setOptionValue('value', v);
    this.props.win.Dofucks.Path.setPath(this.state._[this.tag].paths[v].path);
  }

  onLoaded(data) {
    setTimeout(() => {
      this.onPathChosen(null, null, data.value);
    }, 500);
    return data;
  }

  render() {
    return (
      <Grid>
        <Row is="nospace">
          <Cell is="7">
            <DropDownMenu value={this.state._[this.tag].value} onChange={this.onPathChosen.bind(this)} autoWidth={false} style={{width: "100%"}}>
              {
                this.state._[this.tag].paths.map((elem, i) => {
                  return <MenuItem key={i} value={i} primaryText={elem.name} />
                })
              }
            </DropDownMenu>
          </Cell>
          <Cell is="5">
            <FlatButton
              label="Load paths"
              containerElement="label"
              style={{height: 48, lineHeight: "48px"}}
            >
              <input
                type="file"
                style={uploadInputStyle}
                onChange={this.onFileLoaded.bind(this)}
              />
            </FlatButton>
          </Cell>
        </Row>
      </Grid>
    )
  }

  onFileLoaded(e) {
    var file = e.target.files[0];
			if (!file) {
				return;
			}
			var reader = new FileReader();
			reader.onload = function(e) {
				var parsed;
				try {
					var withoutspaces = e.target.result.replace(/\t\n\r/gi, '');
					parsed = JSON.parse(withoutspaces);
          this.validateJsonPaths(parsed);
				} catch (e) {
					alert("Invalid json file");
					console.error(e);
				}
			}.bind(this);
			reader.readAsText(file);
  }

  validateJsonPaths(obj) {
		var regex = /^(-?\d+),(-?\d+)$/;
		var invalids = {};
    var paths = [];
		for (var key in obj) {
			var hasInvalid = false;
			var positions = obj[key];
			for (var i = 0; i < positions.length; ++i) {
				if (!regex.test(positions[i])) {
					hasInvalid = true;
					invalids[key] ? invalids[key].push(positions[i]) : invalids[key] = [positions[i]];
				}
			}
			if (!hasInvalid) {
				paths.push({
          name: key,
          path: obj[key]
        });
			}
		}
		for (var prop in invalids) {
			if (invalids.hasOwnProperty(prop)) {
				console.error(invalids);
				alert("Check console to see invalid entries");
			}
		}
    this.setOptionValue('paths', paths);
    this.onPathChosen(null, null, 0);
	}
}

export default PathChooser;
