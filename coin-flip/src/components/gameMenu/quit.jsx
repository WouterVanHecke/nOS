import React, { Component } from "react";

import "./quit.style.css";
import { clearProgress } from "../../storage/ls";

class Quit extends Component {
  saveProgress = () => {
    this.props.saveProgress(!this.props.won, this.props.timer);
    this.props.history.goBack();
  };

  quit = () => {
    clearProgress();
    this.props.setCoinsThisRun(0);
    if (this.props.level === 1) {
      this.props.completeTutorialLevel();
    }
    this.props.history.goBack();
  };

  render() {
    const screenStyle = ["quitRoot"];
    if (this.props.user.mouse && this.props.user.tempMouse) {
      screenStyle.push("custom");
    }

    return (
      <div className={screenStyle.join(" ")}>
        <div className="quit" onClick={this.quit}>
          Quit without saving
        </div>
        {this.props.level !== 1 && (
          <div className="save" onClick={this.saveProgress}>
            Quit and save progress
          </div>
        )}
      </div>
    );
  }
}

export default Quit;
