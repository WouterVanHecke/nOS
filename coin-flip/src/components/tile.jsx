import React, { Component } from "react";
import Confetti from "react-dom-confetti";
import Explosion from "react-explode/Explosion4";

import "./tile.style.css";
import config from "../config/confetti";

class Tile extends Component {
  renderMemoView = () => {
    const { memo } = this.props;
    return (
      <div className="memoTile">
        <div className="memoCard one">{memo.one && "1"}</div>
        <div className="memoCard two">{memo.two && "2"}</div>
        <div className="memoCard three">{memo.three && "3"}</div>
        <div className="memoCard shitcoin">
          {memo.shitcoin && (
            <img
              style={{ width: 40, height: 40 }}
              src={require("../images/sc.png")}
              alt="shitcoin"
            />
          )}
        </div>
      </div>
    );
  };

  renderCorrectImage = value => {
    switch (value) {
      case 1:
        return (
          <img
            style={{ width: 100, height: 100 }}
            src={require("../images/one.png")}
            alt="one"
          />
        );
      case 2:
        return (
          <img
            style={{ width: 100, height: 100 }}
            src={require("../images/two.png")}
            alt="one"
          />
        );
      case 3:
        return (
          <img
            style={{ width: 100, height: 100, objectFit: "cover" }}
            src={require("../images/three.png")}
            alt="one"
          />
        );
      default:
        return null;
    }
  };

  renderTileType = () => {
    const { type, gridColumnStart, gridRowStart } = this.props;
    switch (type) {
      case "secret":
        const { tile, rows, onClick, isCurrentMemoTile } = this.props;
        const cardStyle = ["flip-card-inner"];
        const tileStyle = ["tile"];
        if (tile.clicked) {
          cardStyle.push("clicked");
        }
        if (isCurrentMemoTile) {
          tileStyle.push("memoClicked");
        }
        return (
          <div
            className={tileStyle.join(" ")}
            style={{
              gridColumnStart:
                tile.location % rows === 0 ? rows : tile.location % rows,
              gridColumEnd:
                (tile.location % rows === 0 ? rows : tile.location % rows) + 1
            }}
          >
            <div
              className={cardStyle.join(" ")}
              onClick={() => !this.props.disabled.disabled && onClick()}
            >
              <div className="flip-card-front">{this.renderMemoView(tile)}</div>
              <div className="flip-card-back">
                {tile.type === "points" ? (
                  tile.clicked ? (
                    tile.value
                  ) : (
                    "?"
                  )
                ) : tile.clicked ? (
                  <img
                    style={{ width: "80%", height: "80%" }}
                    src={require("../images/sc.png")}
                    alt="shitcoin"
                  />
                ) : (
                  "?"
                )}
              </div>
            </div>
            <Confetti
              style={{ marginLeft: "-600px!important" }}
              active={
                tile.clicked &&
                tile.type === "points" &&
                tile.value !== 1 &&
                !this.props.disabled.disabled
              }
              config={config}
            />
            {tile.type === "bomb" &&
              tile.clicked &&
              !this.props.disabled.won && (
                <Explosion
                  style={{ position: "absolute" }}
                  size="300"
                  delay={0.5}
                  color="red"
                />
              )}
          </div>
        );

      case "info":
        let { amountOfBombs, amountOfPoints } = this.props;
        return (
          <div
            className="info"
            style={{
              gridColumnStart,
              gridColumEnd: gridColumnStart + 1,
              gridRowStart,
              gridRowEnd: gridRowStart + 1
            }}
          >
            <div className="shitcoinsTotal">
              <img
                style={{ width: "2.3vw", height: "2.3vw" }}
                src={require("../images/sc.png")}
                alt="shitcoin"
              />
              <h3>{amountOfBombs}</h3>
            </div>
            <h3>POINTS: {amountOfPoints}</h3>
          </div>
        );

      case "timer":
        let { timer } = this.props;
        return (
          <div
            className="info"
            style={{
              gridColumnStart,
              gridColumEnd: gridColumnStart + 1,
              gridRowStart,
              gridRowEnd: gridRowStart + 1
            }}
          >
            <h3>Timer</h3>
            <h3>{timer}</h3>
          </div>
        );

      default:
        break;
    }
  };

  render() {
    return this.renderTileType();
  }
}

export default Tile;
