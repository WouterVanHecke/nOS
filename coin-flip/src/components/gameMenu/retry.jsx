import React, { Component } from "react";

import "./retry.style.css";

class Retry extends Component {
  render() {
    const screenStyle = ["retryRoot"];
    const screenStyle2 = ["retryDoubleRoot"];
    if (this.props.user.mouse && this.props.user.tempMouse) {
      screenStyle.push("custom");
    }

    if (this.props.user.mouse && this.props.user.tempMouse) {
      screenStyle2.push("custom");
    }

    return this.props.won ? (
      this.props.level !== 1 && (
        <div
          className={screenStyle.join(" ")}
          onClick={this.props.onClickNextLevel}
        >
          Next Level
        </div>
      )
    ) : this.props.disabled ? (
      <div className={screenStyle.join(" ")} onClick={this.props.resetRun}>
        Restart Run
      </div>
    ) : (
      <div className={screenStyle2.join(" ")}>
        <div className="clear" onClick={this.props.resetLevel}>
          Clear
        </div>
        <div className="restart" onClick={this.props.resetRun}>
          Restart run
        </div>
      </div>
    );
  }
}

export default Retry;
