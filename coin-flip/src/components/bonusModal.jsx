import React, { Component } from "react";
import { Modal, Button } from "@material-ui/core";

import "./BonusModal.style.css";

class BonusModal extends Component {
  calculateSpecialTickets = () => {
    const { holdingScore } = this.props;
    let sp = Math.ceil(holdingScore / 10000);
    if (sp > 5) {
      sp = 5;
    } else if (sp === 0) {
      sp = 1;
    }
    return sp;
  };

  calculateCoins = () => {
    const { holdingScore } = this.props;
    let coins = Math.ceil(holdingScore / 1000);
    if (coins > 1000) {
      coins = 1000;
    } else if (coins === 0) {
      coins = 100;
    }
    return coins;
  };

  render() {
    return (
      <Modal open={this.props.bonusActive}>
        <div className="bonusModal">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              height: "100%",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <p>Bonus elements based on your holding score!</p>
            <div
              style={{ display: "flex", flexDirection: "row", width: "100%" }}
            >
              <div className="coins">
                <img src={require("../images/coins.png")} alt="coins" />{" "}
                {this.calculateCoins()}
              </div>
              <div className="special">
                <img
                  src={require("../images/specialTicket.gif")}
                  alt="specialTicket"
                />{" "}
                {this.calculateSpecialTickets()}
              </div>
            </div>
            <div className="next">
              <Button
                variant="contained"
                color="primary"
                className="button"
                onClick={this.props.closeBonusModal}
              >
                I'll take that
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

export default BonusModal;
