import React, { Component } from "react";
import { Modal, Button } from "@material-ui/core";
import moment from "moment";

import "./tipModal.style.css";

class TipModal extends Component {
  state = { timer: null, choice: false, free: false };

  getCorrevtTimeView = timestamp => {
    if (timestamp < 1000 * 60) {
      // seconds
      return (
        Math.floor(timestamp / 1000) + " seconds left until free daily tip"
      );
    } else if (timestamp < 1000 * 60 * 60) {
      //minutes
      return (
        Math.floor(timestamp / 1000 / 60) + " minutes left until free daily tip"
      );
    } else {
      //hours
      return (
        Math.floor(timestamp / 1000 / 60 / 60) +
        " hours left until free daily tip"
      );
    }
  };

  getAvailability = willOpen => {
    if (willOpen) {
      const { dailyTipTimer } = this.props;
      const miliInDay = 86400000;
      if (dailyTipTimer === null) {
        this.setState({ timer: "Free daily tip available", free: true });
      } else {
        let now = moment().valueOf();
        let interval = now - dailyTipTimer;
        if (interval > miliInDay) {
          this.setState({ timer: "Free daily tip available", free: true });
        } else {
          let time = this.getCorrevtTimeView(miliInDay - interval);
          this.setState({
            timer: time,
            free: false
          });

          setInterval(() => {
            let now = moment().valueOf();
            let interval = now - dailyTipTimer;

            let time = this.getCorrevtTimeView(miliInDay - interval);
            this.setState({
              timer: time,
              free: false
            });
          }, 1000);
        }
      }
    }
  };

  markChoice = choice => {
    this.setState({ choice });
  };

  componentWillReceiveProps(nextProps) {
    this.getAvailability(nextProps.dailyTip);
  }

  render() {
    const multiStyle = ["multi"];
    const bombStyle = ["bomb"];
    const screenStyle = ["tipModal"];
    if (this.state.choice) {
      multiStyle.push("choiceClicked");
    } else {
      bombStyle.push("choiceClicked");
    }
    if (this.props.user.mouse && this.props.user.tempMouse) {
      screenStyle.push("custom");
    }

    return (
      <Modal open={this.props.dailyTip}>
        <div className={screenStyle.join(" ")}>
          <p>{this.state.timer}</p>
          <div className="poison">
            <div className="tiles">
              <div
                className={multiStyle.join(" ")}
                onClick={() => this.markChoice(true)}
              >
                2
              </div>
              <div
                className={bombStyle.join(" ")}
                onClick={() => this.markChoice(false)}
              >
                <img
                  style={{ width: "80%", height: "80%" }}
                  src={require("../images/sc.png")}
                  alt="shitcoin"
                />
              </div>
            </div>
            <p>Choose your poison...</p>
          </div>
          <div className="pay">
            <Button
              variant="outlined"
              color="primary"
              className="button"
              onClick={() =>
                this.props.continueDailyTip(this.state.free, this.state.choice)
              }
            >
              {this.state.free ? "show me" : "- 1 Special ticket"}
            </Button>
          </div>
          <div className="pay">
            <Button
              variant="outlined"
              color="primary"
              className="button"
              onClick={this.props.closeDailyModal}
            >
              No thanks
            </Button>
          </div>
        </div>
      </Modal>
    );
  }
}

export default TipModal;
