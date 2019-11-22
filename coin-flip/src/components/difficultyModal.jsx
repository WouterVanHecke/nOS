import React, { Component } from "react";
import { Modal, Button } from "@material-ui/core";

import "./difficultyModal.style.css";

class DifficultyModal extends Component {
  state = { difficulty: 2 };

  getDescription = () => {
    switch (this.state.difficulty) {
      case 1:
        return "This is the easiest difficulty. During the mode, there will always be at least 1 row or column without a shitcoin. This difficulty will have a coin multiplier of 0.8!";

      case 2:
        return "Just as the label suggests, you won't get any special treatment during this mode. Rows and columns without a shitcoin might still randomly occur. This difficulty will have a coin multiplier of 1!";

      case 3:
        return "The floor is lava. During this export mode, even pressing an 1 value tile will result in a loss. Can you figure out which tiles are more valuable? This difficulty will have a coin multiplier of 2!";

      default:
        return null;
    }
  };

  render() {
    const easyStyle = [];
    const normalStyle = [];
    const exportStyle = [];

    switch (this.state.difficulty) {
      case 1:
        easyStyle.push("clicked");
        break;

      case 2:
        normalStyle.push("clicked");
        break;

      case 3:
        exportStyle.push("clicked");
        break;

      default:
        break;
    }

    const screenStyle = ["difficultyModal"];
    if (this.props.user.mouse && this.props.user.tempMouse) {
      screenStyle.push("custom");
    }

    return (
      <Modal open={this.props.difficultyModal}>
        <div className={screenStyle.join(" ")}>
          <p className="modalTitle">Choose your difficulty</p>
          <p className="modalDescription">{this.getDescription()}</p>
          <div className="difficultyButton">
            <div className={easyStyle.join(" ")}>
              <Button
                onClick={() => this.setState({ difficulty: 1 })}
                variant="contained"
                color="primary"
              >
                Easy
              </Button>
            </div>
            <div className={normalStyle.join(" ")}>
              <Button
                onClick={() => this.setState({ difficulty: 2 })}
                variant="contained"
                color="primary"
              >
                Normal
              </Button>
            </div>
            <div className={exportStyle.join(" ")}>
              <Button
                onClick={() => this.setState({ difficulty: 3 })}
                variant="contained"
                color="primary"
              >
                Expert
              </Button>
            </div>
          </div>
          <div className="advanceButtons">
            <div className="back">
              <Button
                onClick={this.props.closeDifficultyModal}
                variant="contained"
                color="primary"
              >
                Go Back
              </Button>
            </div>
            <div className="leggo">
              <Button
                onClick={() => this.props.leggo(this.state.difficulty)}
                variant="contained"
                color="primary"
              >
                Let's Go
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

export default DifficultyModal;
