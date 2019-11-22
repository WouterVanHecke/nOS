import React, { Component } from "react";
import { connect } from "react-redux";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import Icon from "@material-ui/core/Icon";
import posed from "react-pose";

import { initializeLeaderboard } from "../redux/actions/leaderboardActions";
import { initializeUser } from "../redux/actions/userActions";

import "./leaderboard.style.css";
import Header from "./header";

const Content = posed.div({
  out: { opacity: 0, transition: { duration: 600 } },
  in: { opacity: 1, transition: { duration: 600 } }
});

const Back = posed.div({
  out: { opacity: 0, transition: { duration: 600 } },
  in: { opacity: 1, transition: { duration: 600 } }
});

class Leaderboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 0,
      activeDifficultyTab: 0,
      header: "out",
      content: "out",
      back: "out",
      type: 10,
      difficulty: 10
    };

    props.initializeUser();
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ header: "in" });
    }, 300);
    setTimeout(() => {
      this.setState({ content: "in", back: "in" });
    }, 800);
  }

  getFastestRun = times => {
    const reducedTimes = times.map(time => {
      return time.minutes * 60 + time.seconds;
    });

    reducedTimes.sort((a, b) => a - b);
    if (reducedTimes[0] === undefined) {
      return "None";
    }
    return reducedTimes[0] + " seconds";
  };

  handleChangeType = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  renderContent = (type, difficulty) => {
    if (type === 0) {
      const { global } = this.props.leaderboard;
      // Global information
      if (difficulty === 0) {
        const { easy } = global;
        // easy difficulty info

        return (
          <div className="globalContainer">
            {easy.map((record, index) => {
              return (
                <div className="globalRow">
                  <p className="position">{index + 1}</p>
                  <p className="username">{record.email}</p>
                  <p className="time">
                    time: {record.time.minutes}m {record.time.seconds}s
                  </p>
                  <p className="completed">completed: {record.completed}</p>
                </div>
              );
            })}
          </div>
        );
      } else if (difficulty === 1) {
        const { normal } = global;
        // normal difficulty info
        return (
          <div className="globalContainer">
            {normal.map((record, index) => {
              return (
                <div className="globalRow">
                  <p className="position">{index + 1}</p>
                  <p className="username">{record.email}</p>
                  <p className="time">
                    time: {record.time.minutes}m {record.time.seconds}s
                  </p>
                  <p className="completed">completed: {record.completed}</p>
                </div>
              );
            })}
          </div>
        );
      } else {
        const { expert } = global;
        // expert difficulty info
        return (
          <div className="globalContainer">
            {expert.map((record, index) => {
              return (
                <div className="globalRow">
                  <p className="position">{index + 1}</p>
                  <p className="username">{record.email}</p>
                  <p className="time">
                    time: {record.time.minutes}m {record.time.seconds}s
                  </p>
                  <p className="completed">completed: {record.completed}</p>
                </div>
              );
            })}
          </div>
        );
      }
    } else {
      const { personal } = this.props.leaderboard;
      // Personal information
      if (difficulty === 0) {
        const { easy } = personal;
        // easy difficulty info
        return (
          <React.Fragment>
            <div className="runs">
              <p>Amount of runs started: {easy.initiated}</p>
              <p>Amount of runs completed: {easy.completed}</p>
              <p>
                Success rate:{" "}
                {easy.completed === 0
                  ? 0
                  : Math.round((easy.completed / easy.initiated) * 100)}
                %
              </p>
            </div>
            <div className="time">
              <p>Fastest time: {this.getFastestRun(easy.times)}</p>
            </div>
          </React.Fragment>
        );
      } else if (difficulty === 1) {
        const { normal } = personal;
        // normal difficulty info
        return (
          <React.Fragment>
            <div className="runs">
              <p>Amount of runs started: {normal.initiated}</p>
              <p>Amount of runs completed: {normal.completed}</p>
              <p>
                Success rate:{" "}
                {normal.completed === 0
                  ? 0
                  : Math.round((normal.completed / normal.initiated) * 100)}
                %
              </p>
            </div>
            <div className="time">
              <p>Fastest time: {this.getFastestRun(normal.times)}</p>
            </div>
          </React.Fragment>
        );
      } else {
        const { expert } = personal;
        // expert difficulty info
        return (
          <React.Fragment>
            <div className="runs">
              <p>Amount of runs started: {expert.initiated}</p>
              <p>Amount of runs completed: {expert.completed}</p>
              <p>
                Success rate:{" "}
                {expert.completed === 0
                  ? 0
                  : Math.round((expert.completed / expert.initiated) * 100)}
                %
              </p>
            </div>
            <div className="time">
              <p>Fastest time: {this.getFastestRun(expert.times)}</p>
            </div>
          </React.Fragment>
        );
      }
    }
  };

  sortRecordsOnTime = records => {
    records.sort((a, b) => {
      const timeA = a.time;
      const secondsA = timeA.minutes * 60 + timeA.seconds;
      const timeB = b.time;
      const secondsB = timeB.minutes * 60 + timeB.seconds;
      return secondsA - secondsB;
    });
  };

  renderRow = (record, index) => {
    return (
      <div
        className={
          index === 0
            ? "recordRow first"
            : index === 1
            ? "recordRow second"
            : index === 2
            ? "recordRow third"
            : "recordRow"
        }
      >
        <div
          className={
            index === 0
              ? "recordPosition first"
              : index === 1
              ? "recordPosition second"
              : index === 2
              ? "recordPosition third"
              : "recordPosition"
          }
        >
          {index + 1}
        </div>
        <div
          className={
            index === 0
              ? "recordName first"
              : index === 1
              ? "recordName second"
              : index === 2
              ? "recordName third"
              : "recordName"
          }
        >
          Player: {record.email}
        </div>
        <div
          className={
            index === 0
              ? "recordInfo first"
              : index === 1
              ? "recordInfo second"
              : index === 2
              ? "recordInfo third"
              : "recordInfo"
          }
        >
          <div className="recordTime">
            Time: {record.time.minutes}m {record.time.seconds}s
          </div>
          <div className="recordCompleted">
            Times completed: {record.completed}
          </div>
        </div>
        <div className="recordLine" />
      </div>
    );
  };

  renderEmpty = () => {
    return <div className="emptyRows">No records to show</div>;
  };

  renderGlobal = () => {
    const { difficulty } = this.state;
    let records;
    switch (difficulty) {
      case 10:
        records = this.props.leaderboard.global.easy;
        break;

      case 20:
        records = this.props.leaderboard.global.normal;
        break;

      case 30:
        records = this.props.leaderboard.global.expert;
        break;

      default:
        break;
    }

    this.sortRecordsOnTime(records);

    if (records.length === 0) {
      return this.renderEmpty();
    }

    const recordRows = records.map((record, index) =>
      this.renderRow(record, index)
    );

    return recordRows;
  };

  renderPersonalRow = (title, info, line) => {
    return (
      <div className="personalRoot">
        <div className="personalTitle">{title}</div>
        <div className="personalLeft">
          <div className="personalInitiated">
            runs started: {info.initiated}
          </div>
          <div className="personalCompleted">
            runs completed: {info.completed}
          </div>
        </div>
        <div className="personalRight">
          <div className="personalRatio">
            Success rate:{" "}
            {info.completed === 0
              ? 0
              : Math.round((info.completed / info.initiated) * 100)}
            %
          </div>
          <div className="personalTime">
            Fastest time: {this.getFastestRun(info.times)}
          </div>
        </div>
        {line && <div className="recordLine" />}
      </div>
    );
  };

  renderPersonal = () => {
    const easy = this.props.leaderboard.personal.easy;
    const normal = this.props.leaderboard.personal.normal;
    const expert = this.props.leaderboard.personal.expert;

    return (
      <React.Fragment>
        {this.renderPersonalRow("Easy", easy, true)}
        {this.renderPersonalRow("Normal", normal, true)}
        {this.renderPersonalRow("Expert", expert, false)}
      </React.Fragment>
    );
  };

  renderLeaderboardScreen = () => {
    const screenStyle = ["leaderboardRoot"];
    if (this.props.user.mouse && this.props.user.tempMouse) {
      screenStyle.push("custom");
    }

    return (
      <div className={screenStyle.join(" ")}>
        <Header
          header={this.state.header}
          user={this.props.user}
          screen={"store"}
        />
        <Content pose={this.state.content} className="contentContainer">
          <div className="contentPanel">
            <div className="dropDownMenu">
              <FormControl variant="outlined" className="formControl">
                <Select
                  value={this.state.type}
                  onChange={this.handleChangeType}
                  input={
                    <OutlinedInput
                      labelWidth={40}
                      name="type"
                      id="outlined-type-simple"
                    />
                  }
                >
                  <MenuItem value={10}>Global</MenuItem>
                  <MenuItem value={20}>Personal</MenuItem>
                </Select>
              </FormControl>
              {this.state.type === 10 && (
                <FormControl variant="outlined" className="formControl">
                  <Select
                    value={this.state.difficulty}
                    onChange={this.handleChangeType}
                    input={
                      <OutlinedInput
                        labelWidth={40}
                        name="difficulty"
                        id="outlined-difficulty-simple"
                      />
                    }
                  >
                    <MenuItem value={10}>Easy</MenuItem>
                    <MenuItem value={20}>Normal</MenuItem>
                    <MenuItem value={30}>Expert</MenuItem>
                  </Select>
                </FormControl>
              )}
            </div>
            <div className="leaderboardContainer">
              <div className="leaderboardContent">
                {this.state.type === 10 && this.renderGlobal()}
                {this.state.type === 20 && this.renderPersonal()}
              </div>
            </div>
          </div>
        </Content>
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
  };

  render() {
    const { activeTab, activeDifficultyTab } = this.state;
    const leftTabStyle = ["leaderboardTab", "left"];
    const rightTabStyle = ["leaderboardTab", "right"];
    const leftContentTabStyle = ["leaderboardTabContent", "left"];
    const centerContentTabStyle = ["leaderboardTabContent", "center"];
    const rightContentTabStyle = ["leaderboardTabContent", "right"];
    const screenStyle = ["leaderboardScreen"];
    if (this.props.user.mouse && this.props.user.tempMouse) {
      screenStyle.push("custom");
    }
    if (activeTab === 0) {
      leftTabStyle.push("active");
    } else {
      rightTabStyle.push("active");
    }
    if (activeDifficultyTab === 0) {
      leftContentTabStyle.push("active");
    } else if (activeDifficultyTab === 1) {
      centerContentTabStyle.push("active");
    } else {
      rightContentTabStyle.push("active");
      leftContentTabStyle.push("back");
    }

    return this.renderLeaderboardScreen();
  }
}

const mapStateToProps = state => {
  return { leaderboard: state.leaderboard, user: state.user };
};

const mapDispatchToProps = dispatch => {
  return {
    initializeLeaderboard: () => dispatch(initializeLeaderboard()),
    initializeUser: () => dispatch(initializeUser())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Leaderboard);
