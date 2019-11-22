import React, { Component } from "react";
import Confetti from "react-dom-confetti";

import "./endingConfetti.style.css";
import { endConfetti } from "../config/confetti";

class EndingConfetti extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="endConfetti" style={{ top: "10%", left: "15%" }}>
          <Confetti active={this.props.tempState} config={endConfetti(335)} />
        </div>
        <div className="endConfetti" style={{ top: "10%", right: "15%" }}>
          <Confetti active={this.props.tempState} config={endConfetti(225)} />
        </div>
        <div className="endConfetti" style={{ bottom: "10%", left: "15%" }}>
          <Confetti active={this.props.tempState} config={endConfetti(55)} />
        </div>
        <div className="endConfetti" style={{ bottom: "10%", right: "15%" }}>
          <Confetti active={this.props.tempState} config={endConfetti(125)} />
        </div>
      </React.Fragment>
    );
  }
}

export default EndingConfetti;
