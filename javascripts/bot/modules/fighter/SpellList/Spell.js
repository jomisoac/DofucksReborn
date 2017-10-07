import React from 'react';

class Spell extends React.Component {
  constructor(props) {
    super(props);
  }

  onClick() {
    this.props.onSelectSpell(this.props.spellId, !this.props.selected);
  }

  render() {
    return (
      <div style={{width: "11.11%", boxSizing: "border-box"}} onClick={this.onClick.bind(this)}>
        <div className="spell-container" style={!this.props.selected ? {WebkitFilter: "brightness(50%)"} : {}}>
          <img className="spell-img"
            src={"http://dl.ak.ankama.com/games/dofus-tablette/assets/2.15.15/gfx/spells/sort_"+this.props.iconId+".png"}
          />
        </div>
      </div>
    );
  }
}

export default Spell;
