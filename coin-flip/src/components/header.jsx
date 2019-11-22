import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import posed from "react-pose";

import "./header.style.css";

const HeaderPose = posed.div({
  out: { y: -300, opacity: 0, transition: { duration: 600 } },
  in: { y: 0, opacity: 1, transition: { duration: 600 } }
});

class Header extends Component {
  constructor(props) {
    super(props);
    if (props.screen === "mainscreen") {
      props.initializeUser();
    }
  }
  getCorrectDifficulty = () => {
    const { difficulty } = this.props;
    switch (difficulty) {
      case 1:
        return "Easy";

      case 2:
        return "Normal";

      case 3:
        return "Hard";

      default:
        return null;
    }
  };

  render() {
    if (this.props.screen === "mainscreen") {
      if (this.props.user.authenticated) {
        return (
          <HeaderPose pose={this.props.header} className="header">
            <h3 style={{ fontSize: "2vw" }}>
              Player:{" "}
              {this.props.user.chosenMethod === "guest"
                ? " Guest"
                : this.props.user.username}
            </h3>
            <div className="coins">
              <img src={require("../images/coins.png")} alt="coins" />
              <p>{this.props.user.totalCoins}</p>
            </div>
            <div className="sp">
              <img
                src={require("../images/specialTicket.gif")}
                alt="specialTicket"
              />
              <p>{this.props.user.specialTickets}</p>
            </div>
          </HeaderPose>
        );
      } else {
        return (
          <HeaderPose pose={this.props.header} className="header">
            <Button
              onClick={() => this.props.register(undefined)}
              variant="contained"
              color="primary"
              className="button"
            >
              Login using nOs ID
            </Button>
            <Button
              onClick={this.props.playAsGuest}
              variant="contained"
              color="primary"
              className="button"
            >
              Play as a guest
            </Button>
          </HeaderPose>
        );
      }
    } else if (this.props.screen === "store") {
      return (
        <HeaderPose pose={this.props.header} className="header">
          <h3 style={{ fontSize: "2vw" }}>
            Player:{" "}
            {this.props.user.chosenMethod === "guest"
              ? " Guest"
              : this.props.user.username.length === 0
              ? "Guest"
              : this.props.user.username}
          </h3>
          <div className="coins">
            <img src={require("../images/coins.png")} alt="coins" />

            <p>{this.props.user.totalCoins}</p>
          </div>
          <div className="sp">
            <img
              src={require("../images/specialTicket.gif")}
              alt="specialTicket"
            />
            <p>{this.props.user.specialTickets}</p>
          </div>
        </HeaderPose>
      );
    } else {
      if (this.props.level === 1) {
        return (
          <HeaderPose pose={this.props.header} className="header">
            <h3 style={{ fontSize: "2vw" }}>Level: Tutorial</h3>
            <h3 style={{ fontSize: "2vw" }}>
              Player:{" "}
              {this.props.user.chosenMethod === "guest"
                ? " Guest"
                : this.props.user.username.length === 0
                ? "Guest"
                : this.props.user.username}
            </h3>
          </HeaderPose>
        );
      } else {
        return (
          <HeaderPose pose={this.props.header} className="header">
            <h3 style={{ fontSize: "2vw" }}>Level: {this.props.level - 1}</h3>
            <h3 style={{ fontSize: "2vw" }}>
              Difficulty: {this.getCorrectDifficulty()}
            </h3>
            <h3 style={{ fontSize: "2vw" }}>
              Player:{" "}
              {this.props.user.chosenMethod === "guest"
                ? " Guest"
                : this.props.user.username.length === 0
                ? "Guest"
                : this.props.user.username}
            </h3>
          </HeaderPose>
        );
      }
    }
  }
}

export default Header;
