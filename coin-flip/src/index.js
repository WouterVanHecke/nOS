import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./index.css";
import Game from "./components/game";
import MainScreen from "./components/mainScreen";
import LeaderBoard from "./components/leaderboard";
import Store from "./components/store";

import * as serviceWorker from "./serviceWorker";
import store from "./redux/store";

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Switch>
        <Route path="/" exact component={MainScreen} />
        <Route path="/tutorial" exact component={Game} />
        <Route path="/single" exact component={Game} />
        <Route path="/leaderboard" exact component={LeaderBoard} />
        <Route path="/store" exact component={Store} />
      </Switch>
    </Router>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
