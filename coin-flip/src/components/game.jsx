import React, { Component } from "react";
import { connect } from "react-redux";
import posed from "react-pose";

import {
  completeTutorialLevel,
  resetEndGame,
  nextLevel,
  endOfRun,
  saveProgress,
  setCoinsThisRun,
  openDailyModal,
  closeDailyModal,
  initializeDailyTip
} from "../redux/actions/gameActions";
import {
  resetLevel,
  flipAllTiles,
  cancelSecondChance,
  continueSecondChance,
  continueDailyTip,
  confirmResetTimer,
  confirmLoadTimer,
  initializeBoard,
  flipTimer,
  resetTimer,
  flipAllTilesBack
} from "../redux/actions/boardActions";
import { initializeUser } from "../redux/actions/userActions";
import { initializeTutorial } from "../redux/actions/gameActions";
import {
  increaseCompletedRun,
  increaseInitialRun
} from "../redux/actions/leaderboardActions";

import "./game.style.css";

import Board from "./board";
import Header from "./header";
import GameMenu from "./gameMenu";
import EndingConfetti from "./endingConfetti";
import EndingModal from "./endingModal";
import SecondChanceModal from "./secondChanceModal";
import TipModal from "./tipModal";

const BoardPose = posed.div({
  out: { x: -600, opacity: 0, transition: { duration: 600 } },
  in: { x: 0, opacity: 1, transition: { duration: 600 } }
});

class Game extends Component {
  constructor(props) {
    super(props);

    this.props.initializeUser();
    this.props.initializeTutorial();
    this.props.initializeDailyTip();
    if (this.props.game.level !== 1) {
      this.props.increaseInitialRun(this.props.game.difficulty);
    }

    this.state = {
      viewBord: false,
      header: "out",
      board: "out",
      menu: "out",
      timer: {
        minutes: 0,
        seconds: 0
      }
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ header: "in", board: "in", menu: "in" });
    }, 300);

    const interval = setInterval(() => {
      const { runningTimer, reset, loading, value } = this.props.timer;
      if (loading === true) {
        this.setState({ timer: value });
        this.props.confirmLoadTimer();
      } else {
        if (reset) {
          this.setState({ timer: { minutes: 0, seconds: 0 } });
          this.props.confirmResetTimer();
        } else {
          if (runningTimer) {
            if (!this.props.endGame.state) {
              let { minutes, seconds } = this.state.timer;

              if (++seconds === 60) {
                seconds = 0;
                minutes++;
              }
              this.setState({ timer: { minutes, seconds } });
            }
          }
        }
      }
    }, 1000);
    this.interval = interval;
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  advance = (won, { retry = false, quit = false, end = false }) => {
    if (!won) {
      this.props.resetEndGame();
      this.props.resetTimer();
      this.props.flipAllTilesBack();
      if (retry) {
        this.setState({ viewBord: false });
        setTimeout(() => {
          this.props.initializeBoard(
            this.props.game.level === 1 ? 1 : 2,
            this.props.game.difficulty
          );
          if (this.props.game.level !== 1) {
            this.props.endOfRun();
          }
        }, 500);
      } else {
        this.props.endOfRun();
        this.props.history.goBack();
      }
    } else {
      if (this.props.game.level === 1) {
        this.props.resetEndGame();
        this.props.completeTutorialLevel();
        this.props.endOfRun();
        this.props.history.goBack();
      } else {
        if (quit) {
          this.props.saveProgress(false, this.state.timer);
          this.props.resetEndGame();
          this.props.history.goBack();
        } else {
          if (end) {
            this.props.increaseCompletedRun(
              this.props.game.difficulty,
              this.state.timer
            );
            this.props.resetEndGame();
            this.props.endOfRun();
            this.props.resetTimer();
            this.props.history.goBack();
          } else {
            this.onClickNextLevel();
          }
        }
      }
    }
  };

  onClickNextLevel = () => {
    this.setState({ viewBord: false });
    this.props.flipAllTilesBack();
    this.props.resetEndGame();
    this.props.nextLevel();
    this.props.flipTimer();

    setTimeout(() => {
      this.props.initializeBoard(
        this.props.game.level,
        this.props.game.difficulty
      );
    }, 500);
  };

  viewBoard = won => {
    this.setState({ viewBord: true });
    if (won) {
      this.props.flipAllTiles();
    }
  };

  render() {
    const screenStyle = ["game"];
    if (this.props.user.mouse && this.props.user.tempMouse) {
      screenStyle.push("custom");
    }

    const { game, user } = this.props;
    const { minutes, seconds } = this.state.timer;
    return (
      <React.Fragment>
        <div className={screenStyle.join(" ")}>
          <Header
            user={this.props.user}
            level={game.level}
            difficulty={game.difficulty}
            header={this.state.header}
            screen={"game"}
          />
          <BoardPose pose={this.state.board} className="boardPanel">
            <Board
              user={user}
              history={this.props.history}
              timer={minutes + " : " + seconds}
            />
          </BoardPose>
          <GameMenu
            user={this.props.user}
            menu={this.state.menu}
            obtainedCoins={this.props.obtainedCoins}
            coinsThisRun={this.props.coinsThisRun}
            endGame={this.props.endGame}
            resetLevel={this.props.resetLevel}
            onClickNextLevel={this.onClickNextLevel}
            saveProgress={this.props.saveProgress}
            history={this.props.history}
            setCoinsThisRun={this.props.setCoinsThisRun}
            advance={this.advance}
            memoOpen={this.props.open}
            tip={this.props.tip}
            openDailyModal={this.props.openDailyModal}
            timer={this.state.timer}
            level={this.props.game.level}
            completeTutorialLevel={this.props.completeTutorialLevel}
          />
          <EndingModal
            user={this.props.user}
            endGame={this.props.endGame}
            viewingBoard={this.state.viewBord}
            level={this.props.game.level}
            difficulty={this.props.game.difficulty}
            viewBoard={this.viewBoard}
            advance={this.advance}
          />
          <SecondChanceModal
            user={this.props.user}
            secondChance={this.props.endGame.secondChance}
            cancelSecondChance={this.props.cancelSecondChance}
            continueSecondChance={this.props.continueSecondChance}
          />
          <TipModal
            user={this.props.user}
            dailyTip={this.props.tip.dailyTip}
            dailyTipTimer={this.props.tip.dailyTipTimer}
            closeDailyModal={this.props.closeDailyModal}
            continueDailyTip={this.props.continueDailyTip}
          />
        </div>
        <EndingConfetti tempState={this.props.endGame.tempState} />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    game: state.game,
    endGame: state.game.endGame,
    obtainedCoins: state.board.obtainedCoins,
    coinsThisRun: state.game.coinsThisRun,
    open: state.memo.open,
    tip: state.game.tip,
    timer: state.board.timer,
    user: state.user
  };
};

const mapDispatchToProps = dispatch => {
  return {
    completeTutorialLevel: () => dispatch(completeTutorialLevel()),
    resetEndGame: () => dispatch(resetEndGame()),
    nextLevel: () => dispatch(nextLevel()),
    initializeBoard: (level, difficulty) =>
      dispatch(initializeBoard(level, difficulty)),
    resetLevel: () => dispatch(resetLevel()),
    endOfRun: () => dispatch(endOfRun()),
    flipAllTiles: () => dispatch(flipAllTiles()),
    saveProgress: (midGame, timer) => dispatch(saveProgress(midGame, timer)),
    setCoinsThisRun: coins => dispatch(setCoinsThisRun(coins)),
    initializeUser: () => dispatch(initializeUser()),
    initializeTutorial: () => dispatch(initializeTutorial()),
    initializeDailyTip: () => dispatch(initializeDailyTip()),
    cancelSecondChance: () => dispatch(cancelSecondChance()),
    continueSecondChance: () => dispatch(continueSecondChance()),
    openDailyModal: () => dispatch(openDailyModal()),
    closeDailyModal: () => dispatch(closeDailyModal()),
    continueDailyTip: (free, choice) =>
      dispatch(continueDailyTip(free, choice)),
    flipTimer: () => dispatch(flipTimer()),
    resetTimer: () => dispatch(resetTimer()),
    confirmResetTimer: () => dispatch(confirmResetTimer()),
    confirmLoadTimer: () => dispatch(confirmLoadTimer()),
    increaseCompletedRun: (difficulty, timer) =>
      dispatch(increaseCompletedRun(difficulty, timer)),
    flipAllTilesBack: () => {
      dispatch(flipAllTilesBack());
    },
    increaseInitialRun: difficulty => dispatch(increaseInitialRun(difficulty))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Game);
