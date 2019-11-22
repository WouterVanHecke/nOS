import { combineReducers } from "redux";

import game from "./gameReducer";
import board from "./boardReducer";
import user from "./userReducer";
import memo from "./memoReducer";
import leaderboard from "./leaderboardReducer";

const rootReducer = combineReducers({
  game,
  board,
  user,
  memo,
  leaderboard
});

export default rootReducer;
