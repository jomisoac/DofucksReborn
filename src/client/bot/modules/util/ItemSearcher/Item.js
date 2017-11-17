import React from 'react';

class Item extends React.Component {
  constructor(props) {
    super(props);
  }

  onClick() {
    this.props.onItemClick(this.props.id);
  }

  render() {
    return (
      <div style={{width: "11.11%", boxSizing: "border-box"}} onClick={this.onClick.bind(this)}>
        <div className="spell-container">
          <img className="spell-img"
            src={"https://ankama.akamaized.net/games/dofus-tablette/assets/2.17.2/gfx/items/"+this.props.iconId+".png"}
          />
        </div>
      </div>
    );
  }
}

export default Item;
