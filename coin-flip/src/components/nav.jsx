import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import posed from "react-pose";

import { hasProgress } from "../storage/ls";
import "./nav.style.css";

const Menu = posed.div({
  out: { x: 600, opacity: 0, transition: { duration: 600 } },
  in: { x: 0, opacity: 1, transition: { duration: 600 } }
});

class Nav extends Component {
  state = { progress: false };

  componentDidMount() {
    this.props.initializeUser();
    hasProgress().then(progress => {
      this.setState({ progress });
    });
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.user.chosenMethod === "login" &&
      this.props.user.chosenMethod !== "login"
    ) {
      this.props.initializeTutorial();
    }
  }

  navClicked = (link, event) => {
    switch (link) {
      case "tutorial":
        this.props.setLevel(1);
        this.props.onNavPressed("/tutorial");
        break;

      case "single":
        if (!this.props.tutorialDone) {
          event.preventDefault();
        } else {
          if (this.state.progress === false) {
            this.props.openDifficultyModal();
          } else {
            this.props.setLevel(2);
            this.props.onNavPressed("/single");
          }
        }
        break;

      case "multi":
        event.preventDefault();
        break;

      case "leaderboard":
        this.props.onNavPressed("/leaderboard");
        break;

      case "store":
        this.props.onNavPressed("/store");
        break;

      default:
        break;
    }
  };

  render() {
    const { progress } = this.state;
    const screenStyle = ["mainMenu"];
    if (this.props.user.mouse && this.props.user.tempMouse) {
      screenStyle.push("custom");
    }

    return (
      <Menu pose={this.props.nav} className={screenStyle.join(" ")}>
        <ul>
          <li
            className="tutorial"
            onClick={event => this.navClicked("tutorial", event)}
          >
            <Button variant="contained" color="primary" className="button">
              Tutorial
            </Button>
          </li>

          <li
            className="singe"
            onClick={event => this.navClicked("single", event)}
          >
            <Button
              variant="contained"
              disabled={!this.props.tutorialDone}
              color="primary"
              className="button"
            >
              Single player{" "}
              {progress !== false && "( Level " + (progress - 1) + " )"}
            </Button>
          </li>

          <Link to="/multi" onClick={event => this.navClicked("multi", event)}>
            <li className="multiplayer">
              <Button
                variant="contained"
                color="primary"
                disabled
                className="button"
              >
                Multi player ( on the way )
              </Button>
            </li>
          </Link>
          <li
            className="leaderboard"
            onClick={event => this.navClicked("puzzles", event)}
          >
            <Button
              variant="contained"
              color="primary"
              className="button"
              disabled
            >
              Puzzles ( on the way )
            </Button>
          </li>
          <li
            className="leaderboard"
            onClick={event => this.navClicked("leaderboard", event)}
          >
            <Button variant="contained" color="primary" className="button">
              Leaderboard
            </Button>
          </li>
          <li
            className="store"
            onClick={event => this.navClicked("store", event)}
          >
            <Button variant="contained" color="primary" className="button">
              Store
            </Button>
          </li>
        </ul>
      </Menu>
    );
  }
}

export default Nav;
