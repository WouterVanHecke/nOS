import React, { Component } from "react";

import "./coins.style.css";

class Coins extends Component {
  renderCoins = coins => {
    const coinsString = coins.toString();
    const length = coinsString.length;
    let output = "";
    for (let index = length; index < 4; index++) {
      output = output + "0";
    }
    return output + coinsString;
  };

  render() {
    return (
      <div className="coinsRoot">
        <div className="current">
          <p className="coinsTitle">Obtained coins</p>
          <div className="coinRow">
            <img src={require("../../images/coins.png")} alt="coins" />
            <p className="amount">
              {this.renderCoins(this.props.obtainedCoins)}
            </p>
          </div>
        </div>
        <div className="all">
          <p className="coinsTitle">Total coins</p>
          <div className="coinRow">
            <img src={require("../../images/coins.png")} alt="coins" />
            <p className="amount">
              {this.renderCoins(this.props.coinsThisRun)}
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default Coins;
