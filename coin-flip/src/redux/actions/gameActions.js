import {
  SET_LEVEL,
  SET_PLAYER,
  SET_DIFFICULTY,
  COMPLETE_TUTORIAL,
  RESET_GAME,
  NEXT_LEVEL,
  GET_TUTORIAL_STORAGE,
  END_OF_RUN,
  SET_COINS_THIS_RUN,
  OPEN_DAILY_MODAL,
  CLOSE_DAILY_MODAL,
  OPEN_DIFFICULTY_MODAL,
  CLOSE_DIFFICULTY_MODAL,
  GET_DAILY_TIP
} from "./actionTypes";
import store from "../store";
import {
  setTutorialDone,
  getTutorialDone,
  saveLevelProgress,
  getDailyTipFromLocalStorage
} from "../../storage/ls";

export const setLevel = level => {
  return { type: SET_LEVEL, payload: level };
};

export const setPlayer = player => {
  return { type: SET_PLAYER, payload: player };
};

export const setDifficulty = difficulty => {
  return { type: SET_DIFFICULTY, payload: difficulty };
};

export const initializeTutorial = () => {
  return async dispatch => {
    const tutorialDone = await getTutorialDone();
    if (tutorialDone !== null && tutorialDone !== false) {
      dispatch({ type: GET_TUTORIAL_STORAGE, payload: true });
    } else {
      dispatch({ type: GET_TUTORIAL_STORAGE, payload: false });
    }
  };
};

export const resetEndGame = () => {
  return { type: RESET_GAME };
};

export const endOfRun = () => {
  return { type: END_OF_RUN };
};

export const completeTutorialLevel = () => {
  return dispatch => {
    setTutorialDone();
    dispatch({ type: COMPLETE_TUTORIAL });
  };
};

export const nextLevel = () => {
  return dispatch => {
    let { obtainedCoins } = store.getState().board;
    let { difficulty } = store.getState().game;
    switch (difficulty) {
      case 1:
        obtainedCoins = Math.floor(obtainedCoins * 0.8);
        break;

      case 3:
        obtainedCoins = Math.floor(obtainedCoins * 2);
        break;

      default:
        break;
    }
    dispatch({ type: NEXT_LEVEL, payload: obtainedCoins });
  };
};

export const saveProgress = (midGame, timer) => {
  return dispatch => {
    const state = store.getState();
    saveLevelProgress(
      midGame,
      midGame ? state.game.level : state.game.level + 1,
      state.game.difficulty,
      midGame
        ? state.game.coinsThisRun
        : state.game.coinsThisRun + state.board.obtainedCoins,
      midGame ? state.board.field : [],
      midGame ? state.board.obtainedCoins : 1,
      midGame ? state.board.multipliers : [],
      midGame ? state.memo.memoField : [],
      timer
    );
  };
};

export const setCoinsThisRun = coins => {
  return { type: SET_COINS_THIS_RUN, payload: coins };
};

export const openDailyModal = () => {
  return { type: OPEN_DAILY_MODAL };
};

export const closeDailyModal = () => {
  return { type: CLOSE_DAILY_MODAL };
};

export const openDifficultyModal = () => {
  return { type: OPEN_DIFFICULTY_MODAL };
};

export const closeDifficultyModal = () => {
  return { type: CLOSE_DIFFICULTY_MODAL };
};

export const initializeDailyTip = () => {
  return async dispatch => {
    const timer = await getDailyTipFromLocalStorage();
    dispatch({ type: GET_DAILY_TIP, payload: timer });
  };
};
