import {
  UPDATE_FIELD,
  SET_TOTAL_BOMBS,
  SET_TOTAL_POINTS,
  SET_MULTIPLIER,
  SET_TOTAL_COINS,
  TILE_FLIPPED,
  INCREASE_COINS,
  SET_OBTAINED_COINS,
  TILE_RESET,
  TIMER_FLIP,
  TIMER_RESET,
  TIMER_RESET_CONFIRM,
  LOAD_TIMER,
  LOAD_TIMER_CONFIRM,
  FLIP_TILE_BACK
} from "../actions/actionTypes";

const initialState = {
  totalBombs: 99,
  points: 99,
  totalObtainableCoins: 99,
  obtainedCoins: 1,
  multipliers: [],
  field: [],
  lastTileFlipped: {},
  timer: {
    runningTimer: true,
    reset: false
  }
};

const flip = (field, tile) => {
  field.forEach(row => {
    const index = row.findIndex(
      currentTile => currentTile.location === tile.location
    );
    if (index !== -1) row[index].clicked = true;
  });
  return field;
};

const resetTile = (field, tile) => {
  field.forEach(row => {
    const index = row.findIndex(
      currentTile => currentTile.location === tile.location
    );
    if (index !== -1) row[index].clicked = !row[index].clicked;
  });
  return field;
};

const flipTileBack = (field, tile) => {
  field.forEach(row => {
    const index = row.findIndex(
      currentTile => currentTile.location === tile.location
    );
    if (index !== -1) row[index].clicked = false;
  });
  return field;
};

const increase = (current, { incType, amount }) => {
  if (incType === "plus" && current < 1) {
    return current + amount;
  }
  return current * amount;
};

export default function board(state = initialState, action) {
  const newState = { ...state };

  switch (action.type) {
    case UPDATE_FIELD:
      newState.field = [...action.payload];
      return newState;

    case SET_TOTAL_BOMBS:
      newState.totalBombs = action.payload;
      return newState;

    case SET_TOTAL_POINTS:
      newState.points = action.payload;
      return newState;

    case SET_MULTIPLIER:
      newState.multipliers = [...action.payload];
      return newState;

    case SET_TOTAL_COINS:
      newState.totalObtainableCoins = action.payload;
      return newState;

    case SET_OBTAINED_COINS:
      newState.obtainedCoins = action.payload;
      return newState;

    case TILE_FLIPPED:
      newState.lastTileFlipped = action.payload;
      newState.field = [...flip(newState.field, action.payload)];
      return newState;

    case INCREASE_COINS:
      newState.obtainedCoins = increase(newState.obtainedCoins, action.payload);
      return newState;

    case TILE_RESET:
      newState.lastTileFlipped = {};
      newState.field = [...resetTile(newState.field, action.payload)];
      return newState;

    case FLIP_TILE_BACK:
      newState.field = [...flipTileBack(newState.field, action.payload)];
      return newState;

    case TIMER_FLIP:
      newState.timer = {
        ...newState.timer,
        reset: false,
        runningTimer: !state.timer.runningTimer
      };
      return newState;

    case TIMER_RESET:
      newState.timer = { ...newState.timer, reset: true };
      return newState;

    case TIMER_RESET_CONFIRM:
      newState.timer = { reset: false, runningTimer: true };
      return newState;

    case LOAD_TIMER:
      newState.timer = { ...state.timer, loading: true, value: action.payload };
      return newState;

    case LOAD_TIMER_CONFIRM:
      newState.timer = {
        ...state.timer,
        loading: false,
        value: null,
        runningTimer: true
      };
      return newState;

    default:
      return state;
  }
}
