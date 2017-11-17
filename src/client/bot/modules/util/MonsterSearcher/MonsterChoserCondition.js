import React from 'react';

class MonsterChoserCondition extends React.Component {
  constructor(props) {
    super(props);
  }

  onClick() {
    this.props.onClick(this.props.monster);
  }

  render() {
    const styles = {
      condition: {
        position: "absolute",
        top: 0,
        right: 10
      },
      count: {
        position: "absolute",
        top: 0,
        right: 0
      }
    }
    return (
      <div style={{width: "11.11%", boxSizing: "border-box"}} onClick={this.onClick.bind(this)}>
        <div className="spell-container">
          <img className="spell-img"
            src={"https://ankama.akamaized.net/games/dofus-tablette/assets/2.17.3/gfx/monsters/"+this.props.monster.mobId+".png"}
          />
          <span style={styles.condition}>{this.props.monster.condition}</span>
          <span style={styles.count}>{this.props.monster.count}</span>
        </div>
      </div>
    );
  }
}

export default MonsterChoserCondition;
