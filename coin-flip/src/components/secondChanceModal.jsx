import React, { Component } from "react";
import { Modal, Button } from "@material-ui/core";
import Loader from "react-loader-spinner";

import "./secondChanceModal.style.css";

class SecondChanceModal extends Component {
  state = { counter: 10, interval: null };

  componentDidMount() {
    const interval = setInterval(() => {
      if (this.props.secondChance) {
        if (this.state.counter > 0) {
          this.setState({ counter: this.state.counter - 1 });
        } else {
          this.cancel(true);
        }
      } else {
        this.setState({ interval: null, counter: 10 });
      }
    }, 1000);
    this.interval = interval;
  }

  cancel = timeup => {
    clearInterval(this.interval);
    if (timeup) {
      this.setState({ counter: "Time's up" });
      setTimeout(() => {
        this.props.cancelSecondChance();
      }, 1000);
    } else {
      this.props.cancelSecondChance();
    }
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const screenStyle = ["secondModal"];
    if (this.props.user.mouse && this.props.user.tempMouse) {
      screenStyle.push("custom");
    }

    return (
      <Modal open={this.props.secondChance}>
        <div className={screenStyle.join(" ")}>
          <Loader type="Watch" color="#00BFFF" height="13vw" width="13vw" />
          <div className="countdown">{this.state.counter}</div>
          <div className="secondLife">Get your second chance!</div>
          <div className="pay">
            <Button
              variant="outlined"
              color="primary"
              className="button"
              onClick={this.props.continueSecondChance}
            >
              - 1 Special ticket
            </Button>
          </div>
          <div className="pay">
            <Button
              variant="outlined"
              color="primary"
              className="button"
              onClick={() => this.cancel(false)}
            >
              No thanks
            </Button>
          </div>
        </div>
      </Modal>
    );
  }
}

export default SecondChanceModal;
