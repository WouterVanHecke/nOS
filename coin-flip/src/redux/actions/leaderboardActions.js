import {
  LOAD_EASY_PERSONAL,
  LOAD_NORMAL_PERSONAL,
  LOAD_EXPERT_PERSONAL,
  INCREASE_COMPLETE_EASY,
  INCREASE_COMPLETE_NORMAL,
  INCREASE_COMPLETE_EXPERT,
  INCREASE_INITIAL_EASY,
  INCREASE_INITIAL_NORMAL,
  INCREASE_INITIAL_EXPERT,
  LOAD_EASY_GLOBAL,
  LOAD_NORMAL_GLOBAL,
  LOAD_EXPERT_GLOBAL
} from "../actions/actionTypes";
import {
  getPersonalEasyLeaderboard,
  getPersonalNormalLeaderboard,
  getPersonalExpertLeaderboard,
  increaseCompletedRunPersonalLeaderboard,
  increaseInitiatedRunPersonalLeaderboard,
  getGlobalEasyLeaderboard,
  getGlobalNormalLeaderboard,
  getGlobalExpertLeaderboard
} from "../../storage/ls";
import store from "../store";

import { increaseUserCoins } from "./userActions";

export const initializeLeaderboard = () => {
  return async dispatch => {
    const easy = await getPersonalEasyLeaderboard();
    const normal = await getPersonalNormalLeaderboard();
    const expert = await getPersonalExpertLeaderboard();
    const globalEasy = await getGlobalEasyLeaderboard();
    const globalNormal = await getGlobalNormalLeaderboard();
    const globalExpert = await getGlobalExpertLeaderboard();

    if (easy !== null) {
      dispatch({ type: LOAD_EASY_PERSONAL, payload: easy });
    }

    if (normal !== null) {
      dispatch({ type: LOAD_NORMAL_PERSONAL, payload: normal });
    }

    if (expert !== null) {
      dispatch({ type: LOAD_EXPERT_PERSONAL, payload: expert });
    }

    if (globalEasy !== null) {
      dispatch({ type: LOAD_EASY_GLOBAL, payload: globalEasy });
    }

    if (globalNormal !== null) {
      dispatch({ type: LOAD_NORMAL_GLOBAL, payload: globalNormal });
    }

    if (globalExpert !== null) {
      dispatch({ type: LOAD_EXPERT_GLOBAL, payload: globalExpert });
    }
  };
};

export const increaseCompletedRun = (difficulty, timer) => {
  return dispatch => {
    const { coinsThisRun } = store.getState().game;
    dispatch(increaseUserCoins(coinsThisRun));
    increaseCompletedRunPersonalLeaderboard(difficulty, timer);
    switch (difficulty) {
      case 1:
        dispatch({ type: INCREASE_COMPLETE_EASY, playload: timer });
        break;

      case 2:
        dispatch({ type: INCREASE_COMPLETE_NORMAL, playload: timer });
        break;

      case 3:
        dispatch({ type: INCREASE_COMPLETE_EXPERT, playload: timer });
        break;

      default:
        break;
    }
  };
};

export const increaseInitialRun = difficulty => {
  return dispatch => {
    increaseInitiatedRunPersonalLeaderboard(difficulty);
    switch (difficulty) {
      case 1:
        dispatch({ type: INCREASE_INITIAL_EASY });
        break;

      case 2:
        dispatch({ type: INCREASE_INITIAL_NORMAL });
        break;

      case 3:
        dispatch({ type: INCREASE_INITIAL_EXPERT });
        break;

      default:
        break;
    }
  };
};
