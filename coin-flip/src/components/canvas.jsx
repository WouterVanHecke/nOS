import React, { Component } from "react";
import Particles from "react-particles-js";
import posed from "react-pose";

import "./canvas.style.css";
import particlesConfig from "../config/particles";

const CanvasPose = posed.div({
  out: { x: -600, opacity: 0, transition: { duration: 600 } },
  in: { x: 0, opacity: 1, transition: { duration: 600 } }
});

class Canvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstStyle: ["title-flip-card-inner"],
      secondStyle: ["title-flip-card-inner"],
      canvas: "out"
    };
  }

  componentDidMount() {
    const first = setInterval(() => {
      const { firstStyle } = this.state;
      if (firstStyle.length === 1) {
        firstStyle.push("flipped");
        this.setState({ firstStyle });
      } else {
        firstStyle.splice(1, 1);
        this.setState({ firstStyle });
      }
    }, Math.random() * (8000 - 2000) + 2000);
    const second = setInterval(() => {
      const { secondStyle } = this.state;
      if (secondStyle.length === 1) {
        secondStyle.push("flipped");
        this.setState({ secondStyle });
      } else {
        secondStyle.splice(1, 1);
        this.setState({ secondStyle });
      }
    }, Math.random() * (8000 - 2000) + 2000);

    this.setState({ first, second });
  }

  componentWillUnmount() {
    clearTimeout(this.state.first);
    clearTimeout(this.state.second);
  }

  render() {
    return (
      <CanvasPose pose={this.props.canvas} className="canvasPanel">
        <div className="canvas">
          <div className="title">
            <div className="first">
              <div className={this.state.firstStyle.join(" ")}>
                <div className="title-flip-card-front">COIN</div>
                <div className="title-flip-card-back">nOS</div>
              </div>
            </div>
            <div className="second">
              <div className={this.state.secondStyle.join(" ")}>
                <div className="title-flip-card-front">FLIP</div>
                <div className="title-flip-card-back">FLIP</div>
              </div>
            </div>
          </div>
          <Particles className="particles" params={particlesConfig} />
        </div>
      </CanvasPose>
    );
  }
}

export default Canvas;
