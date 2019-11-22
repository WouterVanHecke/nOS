import React, { Component } from "react";
import posed from "react-pose";

import "./gameMenu.style.css";

import Memo from "./gameMenu/memo";
import Coins from "./gameMenu/coins";
import Tip from "./gameMenu/tip";
import Retry from "./gameMenu/retry";
import Quit from "./gameMenu/quit";

const Menu = posed.div({
  out: { x: 600, opacity: 0, transition: { duration: 600 } },
  in: { x: 0, opacity: 1, transition: { duration: 600 } }
});

// memoOpen

class GameMenu extends Component {
  render() {
    const containerStyle = ["options"];
    if (this.props.memoOpen) {
      containerStyle.push("down");
    }
    const screenStyle = ["optionsPanel"];
    if (this.props.user.mouse && this.props.user.tempMouse) {
      screenStyle.push("custom");
    }

    return (
      <Menu pose={this.props.menu} className={screenStyle.join(" ")}>
        <div className={containerStyle.join(" ")}>
          <Coins
            obtainedCoins={this.props.obtainedCoins}
            coinsThisRun={this.props.coinsThisRun}
          />
          <Memo user={this.props.user} disabled={this.props.endGame.state} />
          <Tip
            user={this.props.user}
            disabled={this.props.endGame.state}
            dailyTipTimer={this.props.tip.dailyTipTimer}
            openDailyModal={this.props.openDailyModal}
          />
          <Retry
            level={this.props.level}
            user={this.props.user}
            won={this.props.endGame.won}
            disabled={this.props.endGame.state}
            resetLevel={this.props.resetLevel}
            onClickNextLevel={this.props.onClickNextLevel}
            resetRun={() =>
              this.props.advance(this.props.endGame.won, { retry: true })
            }
          />
          <Quit
            level={this.props.level}
            user={this.props.user}
            won={this.props.endGame.won}
            saveProgress={this.props.saveProgress}
            history={this.props.history}
            setCoinsThisRun={this.props.setCoinsThisRun}
            timer={this.props.timer}
            completeTutorialLevel={this.props.completeTutorialLevel}
          />
        </div>
      </Menu>
    );
  }
}

export default GameMenu;
