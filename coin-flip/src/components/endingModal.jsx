import React, { Component } from "react";
import { Modal, Button } from "@material-ui/core";

import "./endingModal.style.css";

class EndingModal extends Component {
  checkEndOfRun = () => {
    const { level, difficulty } = this.props;
    if (difficulty === 1 && level === 7) {
      return "You've completed a run on easy difficulty, good job! Let's try the normal difficulty.";
    } else if (
      (difficulty === 2 && level === 11) ||
      (difficulty === 3 && level === 11)
    ) {
      return "You've completed a run on normal difficulty, good job! Keep grinding those coins.";
    }
    return "You've collected all the multipliers on this board! Let's advance to the next level!";
  };

  checkEndOfRunButtonText = () => {
    const { level, difficulty } = this.props;
    if (difficulty === 1 && level === 7) {
      return "Complete run";
    } else if (
      (difficulty === 2 && level === 11) ||
      (difficulty === 3 && level === 11)
    ) {
      return "Complete run";
    }
    return "Next Level";
  };

  checkEndOfRunButton = () => {
    const { level, difficulty } = this.props;
    if (difficulty === 1 && level === 7) {
      this.props.advance(this.props.endGame.won, { end: true });
      return;
    } else if (
      (difficulty === 2 && level === 11) ||
      (difficulty === 3 && level === 11)
    ) {
      this.props.advance(this.props.endGame.won, { end: true });
      return;
    }
    this.props.advance(this.props.endGame.won, { retry: true });
  };

  render() {
    const screenStyle = ["endModal"];
    if (this.props.user.mouse && this.props.user.tempMouse) {
      screenStyle.push("custom");
    }

    return (
      <Modal open={this.props.endGame.state && !this.props.viewingBoard}>
        <div className={screenStyle.join(" ")}>
          <h3 className="message">
            {this.props.endGame.won
              ? this.props.level === 1
                ? "That's it for the tutorial level, you've unlocked the single player mode. Go on and collect them coins!"
                : this.checkEndOfRun()
              : "Looks like you've hit a bomb, that sucks... Better luck next time!"}
          </h3>
          <div className="buttons">
            <div className="buttonsRow">
              <Button
                onClick={() => this.props.viewBoard(this.props.endGame.won)}
                variant="contained"
                color="primary"
                className="button"
              >
                View board
              </Button>
              <Button
                onClick={this.checkEndOfRunButton}
                variant="contained"
                color="primary"
                className="button"
              >
                {this.props.endGame.won
                  ? this.props.level === 1
                    ? "Main menu"
                    : this.checkEndOfRunButtonText()
                  : "Restart"}
              </Button>
            </div>
            {this.props.level !== 1 || !this.props.endGame.won ? (
              <Button
                onClick={() =>
                  this.props.advance(this.props.endGame.won, { quit: true })
                }
                variant="contained"
                color="secondary"
              >
                {this.props.endGame.won
                  ? "Quit and save progress"
                  : "Main menu"}
              </Button>
            ) : null}
          </div>
        </div>
      </Modal>
    );
  }
}

export default EndingModal;
