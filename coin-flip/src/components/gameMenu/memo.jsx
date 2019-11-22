import React, { Component } from "react";
import { connect } from "react-redux";

import "./memo.style.css";
import { toggleMemo, toggleMemoValue } from "../../redux/actions/memoActions";

class Memo extends Component {
  state = { open: false, rootStyle: ["memo"] };

  componentDidMount() {
    const { rootStyle } = this.state;
    if (this.props.user.mouse && this.props.user.tempMouse) {
      rootStyle.push("custom");
      this.setState({ rootStyle });
    }
  }

  toggleMemo = open => {
    if (!this.props.disabled) {
      if (!this.props.open && open === 1) {
        const { rootStyle } = this.state;
        rootStyle.push("open");
        this.props.toggleMemo();
        this.setState({ rootStyle });
      } else if (this.props.open && open === 0) {
        const { rootStyle } = this.state;
        rootStyle.splice(rootStyle.findIndex(style => style === "open"), 1);
        this.props.toggleMemo();
        this.setState({ rootStyle });
      }
    }
  };

  toggleMemoValue = value => {
    const { currentMemoTile, toggleMemoValue, memoField } = this.props;
    toggleMemoValue(currentMemoTile.location, value, memoField);
  };

  checkValue = value => {
    const { currentMemoTile, memoField } = this.props;
    if (Object.keys(currentMemoTile).length === 0) {
      return "white";
    } else {
      let memoValues = {};
      memoField.forEach(row => {
        row.forEach(tile => {
          if (tile.location === currentMemoTile.location) {
            memoValues = tile.memo;
          }
        });
      });
      switch (value) {
        case 1:
          if (memoValues.one) {
            return "black";
          }
          break;
        case 2:
          if (memoValues.two) {
            return "black";
          }
          break;
        case 3:
          if (memoValues.three) {
            return "black";
          }
          break;
        case "sc":
          if (memoValues.shitcoin) {
            return "black";
          }
          break;

        default:
          break;
      }
      return "white";
    }
  };

  renderContent = () => {
    if (this.props.open) {
      return (
        <React.Fragment>
          <div
            onClick={() => this.toggleMemoValue(1)}
            className="memoCard one"
            style={{ color: this.checkValue(1) }}
          >
            1
          </div>
          <div
            onClick={() => this.toggleMemoValue(2)}
            className="memoCard two"
            style={{ color: this.checkValue(2) }}
          >
            2
          </div>
          <div
            onClick={() => this.toggleMemoValue(3)}
            className="memoCard three"
            style={{ color: this.checkValue(3) }}
          >
            3
          </div>
          <div
            onClick={() => this.toggleMemoValue("sc")}
            className="memoCard shitcoin"
            style={{ color: this.checkValue("sc") }}
          >
            <img
              style={{ width: 60, height: 60 }}
              src={require("../../images/sc.png")}
              alt="shitcoin"
            />
          </div>
          <div className="memoCard close" onClick={() => this.toggleMemo(0)}>
            Close memo
          </div>
        </React.Fragment>
      );
    } else {
      return "Open memo";
    }
  };

  render() {
    return (
      <div
        className={this.state.rootStyle.join(" ")}
        onClick={() => this.toggleMemo(1)}
      >
        {this.renderContent()}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    open: state.memo.open,
    currentMemoTile: state.memo.currentTile,
    memoField: state.memo.memoField
  };
};

const mapDispatchToProps = dispatch => {
  return {
    toggleMemo: () => dispatch(toggleMemo()),
    toggleMemoValue: (currentMemoTile, value, memoField) =>
      dispatch(toggleMemoValue(currentMemoTile, value, memoField))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Memo);
