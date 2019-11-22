import React, { Component } from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";

import { initializeBoard, flip } from "../redux/actions/boardActions";
import { initializeTutorial, setLevel } from "../redux/actions/gameActions";
import { setCurrentTile } from "../redux/actions/memoActions";
import Tile from "./tile";

import "./board.style.css";

class Board extends Component {
  constructor(props) {
    super(props);

    let { level, difficulty, history } = props;

    if (history.location.pathname === "/single") {
      this.props.setLevel(2);
      level = 2;
    }

    props.initializeBoard(level, difficulty);
    this.state = {
      rootStyle: ["board"],
      messagesStyle: ["tutorialMessages"],
      messageCount: 1
    };
  }

  getCorrectMessage = () => {
    const { messageCount } = this.state;
    switch (messageCount) {
      case 1:
        return "Welcome to the tutorial of nOS Flip. Our playboard is made out of shitcoins and points. You win by collecting al the x2 and x3 cards, touch 1 shitcoin and you'll lose this run. Easy enough right? Or is it?";

      case 2:
        return "Every row and column contains a certain amount of shitcoins and points, as you can see on the sides of the playboard. Use this information to figure out where certain tiles are hidden.";

      case 3:
        return "On the side menu, you'll see a memo button. By pressing this button, you'll be able to take notes on every tile. This method will be very usefull on the higher levels, by eliminating certain combinations, all by keeping track with the memo ability.";

      case 4:
        return "Every day, a free tip is presented to you. You can either choose between revealing a shitcoin or a value tile. When you flip a shitcoin, there's a chance you'll be able to buy a second chance with special tickets.";
      default:
        break;
    }
  };

  continue = () => {
    const { messageCount } = this.state;
    if (messageCount < 4) {
      this.setState({ messageCount: messageCount + 1 });
    } else {
      this.toggleClasses();
      this.setState({ messageCount: 1 });
    }
  };

  getMemoValues = location => {
    let memo = {};
    this.props.memoField.forEach(row => {
      row.forEach(tile => {
        if (tile.location === location) {
          memo = tile.memo;
        }
      });
    });
    return memo;
  };

  repeat = length => {
    let template = "";
    for (let i = 0; i <= length; i++) {
      template = template + Math.floor(100 / (length + 1) - 2) + "% ";
      // template = template + "11vh ";
    }
    return template;
  };

  getColumn = (field, columnIndex) => {
    const column = [];
    field.forEach(row => {
      row.forEach((tile, index) => {
        if (index === columnIndex) {
          column.push(tile);
        }
      });
    });
    return column;
  };

  renderTiles = disabled => {
    const {
      field,
      flip,
      setCurrentMemoTile,
      currentMemoTile,
      waitingForAnimations
    } = this.props;
    return field.map(row => {
      return row.map(tile => {
        return (
          <Tile
            key={tile.location}
            type="secret"
            disabled={{
              disabled: disabled || waitingForAnimations,
              won: this.props.won
            }}
            tile={tile}
            rows={field.length}
            memo={this.getMemoValues(tile.location)}
            isCurrentMemoTile={currentMemoTile.location === tile.location}
            onClick={() =>
              this.props.memoOpen ? setCurrentMemoTile(tile) : flip(tile)
            }
          />
        );
      });
    });
  };

  renderInfoTile = () => {
    const { field } = this.props;
    //ROWS
    const columns = field.map((row, index) => {
      let amountOfBombs = 0;
      let amountOfPoints = 0;
      row.forEach(tile => {
        tile.type === "bomb" && amountOfBombs++;
        if (tile.type === "points") {
          amountOfPoints = amountOfPoints + tile.value;
        }
      });
      return (
        <Tile
          key={Math.random()}
          type="info"
          amountOfBombs={amountOfBombs}
          amountOfPoints={amountOfPoints}
          gridColumnStart={field.length + 1}
          gridRowStart={index + 1}
        />
      );
    });

    // COLUMNS
    const rows = field.map((row, rowIndex) => {
      let amountOfBombs = 0;
      let amountOfPoints = 0;
      const column = this.getColumn(field, rowIndex);
      column.forEach(tile => {
        tile.type === "bomb" && amountOfBombs++;
        if (tile.type === "points") {
          amountOfPoints = amountOfPoints + tile.value;
        }
      });
      return (
        <Tile
          key={Math.random()}
          type="info"
          amountOfBombs={amountOfBombs}
          amountOfPoints={amountOfPoints}
          gridColumnStart={rowIndex + 1}
          gridRowStart={field.length + 1}
        />
      );
    });

    const timer = (
      <Tile
        key={Math.random()}
        type="timer"
        timer={this.props.timer}
        gridColumnStart={field.length + 1}
        gridRowStart={field.length + 1}
      />
    );

    return [...columns, ...rows, timer];
  };

  componentDidMount() {
    if (
      this.props.level === 1 &&
      this.props.history.location.pathname !== "/single"
    ) {
      setTimeout(() => {
        const { rootStyle, messagesStyle } = this.state;
        rootStyle.push("slideDown");
        messagesStyle.push("open");
        this.setState({ rootStyle, messagesStyle });
      }, 1000);
    }
  }

  toggleClasses = () => {
    this.setState({
      rootStyle: ["board"],
      messagesStyle: ["tutorialMessages"]
    });
  };

  render() {
    const { messagesStyle } = this.state;
    if (this.props.user.mouse && this.props.user.tempMouse) {
      if (messagesStyle.findIndex(style => style === "custom") === -1) {
        messagesStyle.push("custom");
      }
    }

    return (
      <React.Fragment>
        <div className={this.state.messagesStyle.join(" ")}>
          <p style={{ fontSize: "1.2vw", marginTop: 0 }}>
            {this.getCorrectMessage()}
          </p>
          <Button
            variant="contained"
            color="primary"
            onClick={() => this.continue()}
          >
            {this.state.messageCount === 4 ? "Let's start" : "Continue"}
          </Button>
        </div>
        <div
          className={this.state.rootStyle.join(" ")}
          style={{
            gridTemplateColumns: this.repeat(this.props.field.length),
            gridTemplateRows: this.repeat(this.props.field.length)
          }}
        >
          {this.renderTiles(this.state.rootStyle.length === 2)}
          {this.renderInfoTile()}
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    level: state.game.level,
    difficulty: state.game.difficulty,
    field: state.board.field,
    memoOpen: state.memo.open,
    memoField: state.memo.memoField,
    currentMemoTile: state.memo.currentTile,
    endOfGame: state.game.endGame.state,
    won: state.game.endGame.won,
    waitingForAnimations: state.game.endGame.disabled
  };
};

const mapDispatchToProps = dispatch => {
  return {
    initializeBoard: (level, difficulty) =>
      dispatch(initializeBoard(level, difficulty)),
    flip: tile => dispatch(flip(tile)),
    setCurrentMemoTile: tile => dispatch(setCurrentTile(tile)),
    setLevel: level => dispatch(setLevel(level)),
    initializeTutorial: () => dispatch(initializeTutorial())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Board);
