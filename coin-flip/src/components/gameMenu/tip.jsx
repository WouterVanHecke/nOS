import React, { Component } from "react";
import moment from "moment";

import "./tip.style.css";

class Tip extends Component {
  getProgressWith = () => {
    const { dailyTipTimer } = this.props;
    const miliInDay = 86400000;
    if (dailyTipTimer === null) {
      return "100%";
    } else {
      const lastTimeUsed = moment(dailyTipTimer);
      const now = moment().valueOf();
      const interval = now - lastTimeUsed;
      if (interval > miliInDay) {
        return "100%";
      } else {
        return (interval / miliInDay) * 100 + "%";
      }
    }
  };

  render() {
    const screenStyle = ["tipRoot"];
    if (this.props.user.mouse && this.props.user.tempMouse) {
      screenStyle.push("custom");
    }

    return (
      <div
        className={screenStyle.join(" ")}
        onClick={this.props.openDailyModal}
      >
        <p>Daily tip</p>
        <div className="progressBar">
          <div className="progress" style={{ width: this.getProgressWith() }} />
        </div>
      </div>
    );
  }
}

export default Tip;
