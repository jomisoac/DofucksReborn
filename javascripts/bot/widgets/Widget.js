import React from 'react';

import {Toolbar, ToolbarTitle, ToolbarGroup} from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import Toggle from 'material-ui/Toggle';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more'
import NavigationExpandLessIcon from 'material-ui/svg-icons/navigation/expand-less'

class Widget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false
    }
  }

  onCollapseTap() {
    var collapsed = this.state.collapsed;
    this.setState({
      collapsed:!collapsed
    });
  }

  onActivateToggle(e, isChecked) {
    if (isChecked) {
      this.props.onEnable();
    } else {
      this.props.onDisable();
    }
  }

  render() {
    let leftIcon = this.state.collapsed ? <NavigationExpandMoreIcon/> : <NavigationExpandLessIcon/>;
    let icon = <IconButton touch={true} onTouchTap={this.onCollapseTap.bind(this)}>{leftIcon}</IconButton>;
    let activateButton = this.props.activable ? <Toggle onToggle={this.onActivateToggle.bind(this)} toggled={this.props.enabled}></Toggle> : null;
    return (
      <div className="widget">
        <Toolbar>
          <ToolbarGroup>{activateButton}</ToolbarGroup>
          <ToolbarTitle text={this.props.title}/>
          <ToolbarGroup lastChild={true}>{icon}</ToolbarGroup>
        </Toolbar>
        <div className="collapsable" style={this.state.collapsed ? {maxHeight: '0'} : {maxHeight: '10000px'}}>
          {this.props.children}
        </div>
      </div>
    )
  }
}

Widget.defaultProps = {
  title: "Default Widget",
  activable: false
};

Widget.propTypes = {
  title: React.PropTypes.string,
  //activable: React.PropTypes.boolean
}

export default Widget;
