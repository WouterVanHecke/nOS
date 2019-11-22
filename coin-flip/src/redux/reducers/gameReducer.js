import {
  SET_LEVEL,
  SET_PLAYER,
  SET_DIFFICULTY,
  BOMB_FLIPPED,
  LEVEL_WON,
  COMPLETE_TUTORIAL,
  RESET_GAME,
  NEXT_LEVEL,
  GET_TUTORIAL_STORAGE,
  END_OF_RUN,
  DISABLE_TILES,
  SET_COINS_THIS_RUN,
  BEGIN_SECOND_CHANCE,
  CANCEL_SECOND_CHANCE,
  UNDISABLE_TILES,
  OPEN_DAILY_MODAL,
  CLOSE_DAILY_MODAL,
  SET_DAILY_TIMER,
  OPEN_DIFFICULTY_MODAL,
  CLOSE_DIFFICULTY_MODAL,
  GET_DAILY_TIP
} from "../actions/actionTypes";

const initialState = {
  level: 1,
  difficulty: 1,
  difficultyModal: false,
  coinsThisRun: 0,
  endGame: {
    state: false,
    won: false,
    disabled: false,
    secondChance: false,
    secondChanceUsed: false,
    tempState: false
  },
  tutorialDone: false,
  tip: {
    dailyTip: false,
    dailyTipTimer: null
  }
};

export default function game(state = initialState, action) {
  const newState = { ...state };

  switch (action.type) {
    case SET_LEVEL:
      newState.level = action.payload;
      return newState;

    case SET_PLAYER:
      newState.player = action.payload;
      return newState;

    case SET_DIFFICULTY:
      newState.difficulty = action.payload;
      return newState;

    case BOMB_FLIPPED:
      newState.endGame = { ...newState.endGame, state: true, won: false };
      return newState;

    case LEVEL_WON:
      newState.endGame = { ...newState.endGame, state: true, won: true };
      return newState;

    case COMPLETE_TUTORIAL:
      newState.tutorialDone = true;
      return newState;

    case RESET_GAME:
      newState.endGame = {
        state: false,
        won: false,
        disabled: false,
        tempState: false,
        secondChance: false
      };
      return newState;

    case NEXT_LEVEL:
      newState.level = state.level + 1;
      newState.coinsThisRun = state.coinsThisRun + action.payload;
      return newState;

    case GET_TUTORIAL_STORAGE:
      newState.tutorialDone = action.payload;
      return newState;

    case END_OF_RUN:
      newState.coinsThisRun = 0;
      newState.level = 2;
      newState.endGame = {
        state: false,
        won: false,
        disabled: false,
        tempState: false,
        secondChance: false
      };
      return newState;

    case DISABLE_TILES:
      newState.endGame = {
        ...newState.endGame,
        disabled: true,
        tempState: action.payload
      };
      return newState;

    case UNDISABLE_TILES:
      newState.endGame = {
        ...newState.endGame,
        disabled: false
      };
      return newState;

    case SET_COINS_THIS_RUN:
      newState.coinsThisRun = action.payload;
      return newState;

    case BEGIN_SECOND_CHANCE:
      newState.endGame = { ...newState.endGame, secondChance: true };
      return newState;

    case CANCEL_SECOND_CHANCE:
      newState.endGame = {
        ...newState.endGame,
        secondChance: false,
        secondChanceUsed: action.payload
      };
      return newState;

    case OPEN_DAILY_MODAL:
      newState.tip = { ...newState.tip, dailyTip: true };
      return newState;

    case CLOSE_DAILY_MODAL:
      newState.tip = { ...newState.tip, dailyTip: false };
      return newState;

    case SET_DAILY_TIMER:
      newState.tip = { ...newState.tip, dailyTipTimer: action.payload };
      return newState;

    case OPEN_DIFFICULTY_MODAL:
      newState.difficultyModal = true;
      return newState;

    case CLOSE_DIFFICULTY_MODAL:
      newState.difficultyModal = false;
      return newState;

    case GET_DAILY_TIP:
      newState.tip = { ...state.tip, dailyTipTimer: action.payload };
      return newState;

    default:
      return state;
  }
}
