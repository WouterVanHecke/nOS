import React, { Component } from "react";
import { connect } from "react-redux";
import posed from "react-pose";
import Loader from "react-loader-spinner";

import Nav from "./nav";
import Canvas from "./canvas";
import Header from "./header";
import DifficultyModal from "./difficultyModal";
import "./mainScreen.style.css";

import {
  playAsGuest,
  initializeUser,
  register,
  closeBonusModal
} from "../redux/actions/userActions";
import {
  setLevel,
  setDifficulty,
  initializeTutorial,
  openDifficultyModal,
  closeDifficultyModal,
  initializeDailyTip
} from "../redux/actions/gameActions";
import BonusModal from "./bonusModal";

const Footer = posed.div({
  out: { y: 200, opacity: 0, transition: { duration: 600 } },
  in: { y: 0, opacity: 1, transition: { duration: 600 } }
});

class MainScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      header: "out",
      canvas: "out",
      nav: "out",
      footer: "out"
    };

    this.props.initializeUser();
    this.props.initializeDailyTip();

    setTimeout(() => {
      this.props.initializeTutorial();
    }, 500);

    if (
      this.props.location.search !== undefined &&
      this.props.location.search !== ""
    ) {
      this.props.register(this.props.location.search);
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ header: "in", canvas: "in", nav: "in", footer: "in" });
    }, 300);
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.user.chosenMethod === "login" &&
      this.props.user.chosenMethod !== "login"
    ) {
      this.props.initializeUser();
    }
  }

  checkAuthentication = () =>
    this.props.user.authenticated ? "auth-post" : "auth-pre";

  onNavPressed = path => {
    this.setState(
      { header: "out", canvas: "out", nav: "out", footer: "out" },
      () =>
        setTimeout(() => {
          this.props.history.push(path);
        }, 600)
    );
  };

  leggo = difficulty => {
    this.props.closeDifficultyModal();
    setTimeout(() => {
      this.props.setLevel(2);
      this.props.setDifficulty(difficulty);
      this.onNavPressed("/single");
    }, 300);
  };

  render() {
    const screenStyle = ["root"];
    if (this.props.user.mouse && this.props.user.tempMouse) {
      screenStyle.push("custom");
    }

    return (
      <div className={screenStyle.join(" ")}>
        <div className={this.checkAuthentication()} />
        <Header
          user={this.props.user}
          register={this.props.register}
          playAsGuest={this.props.playAsGuest}
          initializeUser={this.props.initializeUser}
          header={this.state.header}
          screen={"mainscreen"}
        />
        {this.props.user.authenticated && this.props.location.search === "" && (
          <Canvas canvas={this.state.canvas} />
        )}
        {this.props.user.authenticated && this.props.location.search === "" && (
          <Nav
            nav={this.state.nav}
            onNavPressed={this.onNavPressed}
            user={this.props.user}
            initializeUser={this.props.initializeUser}
            tutorialDone={this.props.game.tutorialDone}
            setLevel={level => this.props.setLevel(level)}
            initializeTutorial={this.props.initializeTutorial}
            openDifficultyModal={this.props.openDifficultyModal}
          />
        )}
        {this.props.user.authenticated && this.props.location.search === "" && (
          <Footer pose={this.state.footer} className="footer">
            <h3>© Wouter Van Hecke</h3>
            <h3>In honor of Voltorb flip, created by the Pokemon Company</h3>
          </Footer>
        )}
        <DifficultyModal
          leggo={this.leggo}
          user={this.props.user}
          difficultyModal={this.props.game.difficultyModal}
          closeDifficultyModal={this.props.closeDifficultyModal}
        />
        <BonusModal
          bonusActive={
            this.props.user.loginBonusFirstTime &&
            this.props.user.chosenMethod === "login"
          }
          closeBonusModal={this.props.closeBonusModal}
          holdingScore={this.props.user.holdingScore}
        />
        {this.props.location.search !== undefined &&
          this.props.location.search !== "" && (
            <div className="loading">
              <Loader
                type="CradleLoader"
                color="#00BFFF"
                height="13vw"
                width="13vw"
              />
              <p>Waiting for backend to respond...</p>
              <p>
                This can take a few seconds if Heroku was sleeping on the job
              </p>
            </div>
          )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { game: state.game, user: state.user };
};

const mapDispatchToProps = dispatch => {
  return {
    playAsGuest: () => dispatch(playAsGuest()),
    register: params => dispatch(register(params)),
    setLevel: level => dispatch(setLevel(level)),
    initializeUser: () => dispatch(initializeUser()),
    initializeTutorial: () => dispatch(initializeTutorial()),
    initializeDailyTip: () => dispatch(initializeDailyTip()),
    openDifficultyModal: () => dispatch(openDifficultyModal()),
    closeDifficultyModal: () => dispatch(closeDifficultyModal()),
    closeBonusModal: () => dispatch(closeBonusModal()),
    setDifficulty: difficulty => dispatch(setDifficulty(difficulty))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainScreen);
