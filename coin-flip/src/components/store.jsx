import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Icon } from "@material-ui/core";
import posed from "react-pose";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";

import "./store.style.css";
import Header from "./header";

import {
  buyMouse,
  buySP,
  initializeUser,
  enableTempMouse,
  disableTempMouse
} from "../redux/actions/userActions";

const Mouse = posed.div({
  out: { y: -100, opacity: 0, transition: { duration: 600 } },
  in: { y: 0, opacity: 1, transition: { duration: 600 } }
});

const SP = posed.div({
  out: { y: -100, opacity: 0, transition: { duration: 600 } },
  in: { y: 0, opacity: 1, transition: { duration: 600 } }
});

const NOS = posed.div({
  out: { y: -100, opacity: 0, transition: { duration: 600 } },
  in: { y: 0, opacity: 1, transition: { duration: 600 } }
});

const Back = posed.div({
  out: { opacity: 0, transition: { duration: 600 } },
  in: { opacity: 1, transition: { duration: 600 } }
});

class Store extends Component {
  constructor(props) {
    super(props);

    props.initializeUser();

    this.state = {
      sp: 1,
      header: "out",
      mouse: "out",
      specialTicket: "out",
      nOS: "out",
      back: "out",
      asset: 10
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ header: "in" });
    }, 300);
    setTimeout(() => {
      this.setState({ mouse: "in" });
    }, 900);
    setTimeout(() => {
      this.setState({ specialTicket: "in" });
    }, 1000);
    setTimeout(() => {
      this.setState({ nOS: "in", back: "in" });
    }, 1100);
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const screenStyle = ["storeScreen"];
    const activeNormalStyle = ["normal"];
    const activeNOSStyle = ["nos"];
    if (this.props.user.mouse && this.props.user.tempMouse) {
      screenStyle.push("custom");
      activeNOSStyle.push("active");
    } else {
      activeNormalStyle.push("active");
    }

    return (
      <div className={screenStyle.join(" ")}>
        <Header
          header={this.state.header}
          user={this.props.user}
          screen={"store"}
        />
        <div className="storeSection">
          <Mouse pose={this.state.mouse} className="itemSetion">
            <div className="icon rotate">
              <img
                src={require("../images/customMouse.png")}
                alt="customMouse"
              />
            </div>
            <div className="StoreItemTitle">Custom mouse</div>
            <div className="buySection">
              <Button
                variant="contained"
                color="primary"
                className="button"
                disabled={this.props.user.mouse}
                onClick={this.props.buyMouse}
              >
                {this.props.user.mouse ? "Obtained" : "500 coins"}
              </Button>
            </div>
            <div className="switch">
              <div
                className={activeNormalStyle.join(" ")}
                onClick={this.props.disableTempMouse}
              >
                Normal
              </div>
              <div
                className={activeNOSStyle.join(" ")}
                onClick={this.props.enableTempMouse}
              >
                nOS
              </div>
            </div>
          </Mouse>
          <SP pose={this.state.specialTicket} className="itemSetion">
            <div className="icon">
              <img
                src={require("../images/specialTicket.gif")}
                alt="customMouse"
              />
            </div>
            <div className="StoreItemTitle">Special tickets</div>

            <div className="buySection row">
              <div className="selectSP">
                <div
                  className="btn"
                  onClick={() => {
                    this.setState({
                      sp: this.state.sp === 1 ? 1 : this.state.sp - 1
                    });
                  }}
                >
                  -
                </div>
                {this.state.sp}
                <div
                  className="btn"
                  onClick={() => {
                    this.setState({ sp: this.state.sp + 1 });
                  }}
                >
                  +
                </div>
              </div>
              <div className="row">
                <Button
                  variant="contained"
                  color="primary"
                  className="button"
                  onClick={() => this.props.buySP("coins", this.state.sp)}
                >
                  {this.state.sp * 10000} coins
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  className="button"
                  disabled={window.NOS === undefined}
                  onClick={() =>
                    this.props.buySP("GAS", this.state.sp, this.state.asset)
                  }
                >
                  {this.state.asset === 10
                    ? this.state.sp * 30 + " NOS"
                    : this.state.asset === 20
                    ? this.state.sp * 0.3 + " GAS"
                    : this.state.sp * 0.1 + " NEO"}
                </Button>
              </div>
            </div>
            {window.NOS !== undefined && (
              <div className="assets">
                <FormControl variant="outlined" className="formControl">
                  <Select
                    value={this.state.asset}
                    onChange={this.handleChange}
                    input={
                      <OutlinedInput
                        labelWidth={40}
                        name="asset"
                        id="outlined-asset-simple"
                      />
                    }
                  >
                    <MenuItem value={10}>NOS</MenuItem>
                    <MenuItem value={20}>GAS</MenuItem>
                    <MenuItem value={30}>NEO</MenuItem>
                  </Select>
                </FormControl>
              </div>
            )}
          </SP>
          <NOS pose={this.state.nOS} className="itemSetion">
            <div className="icon">
              <img src={require("../images/token.png")} alt="nOS token" />
            </div>
            <div className="StoreItemTitle">100 nOS tokens</div>
            <div className="buySection">
              <Button
                variant="contained"
                color="primary"
                className="button"
                disabled
              >
                100 000 coins
              </Button>
            </div>
          </NOS>
        </div>
        <Back
          pose={this.state.back}
          className="absBack"
          onClick={this.props.history.goBack}
        >
          <Icon color="primary" style={{ fontSize: 50 }}>
            arrow_back
          </Icon>{" "}
          <div>Main Screen</div>
        </Back>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return { game: state.game, user: state.user };
};

const mapDispatchToProps = dispatch => {
  return {
    buyMouse: () => dispatch(buyMouse()),
    buySP: (currency, amount, asset) =>
      dispatch(buySP(currency, amount, asset)),
    initializeUser: () => dispatch(initializeUser()),
    disableTempMouse: () => dispatch(disableTempMouse()),
    enableTempMouse: () => dispatch(enableTempMouse())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Store);
