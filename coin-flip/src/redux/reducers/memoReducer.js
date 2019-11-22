import {
  TOGGLE_MEMO,
  SET_FIELD,
  SET_CURRENT_TILE,
  TOGGLE_VALUE,
  RESET_GAME
} from "../actions/actionTypes";

const initialState = {
  open: false,
  currentTile: {},
  memoField: []
};

export default function memo(state = initialState, action) {
  const newState = { ...state };

  switch (action.type) {
    case TOGGLE_MEMO:
      newState.open = !state.open;
      newState.currentTile = state.open ? {} : newState.currentTile;
      return newState;

    case SET_CURRENT_TILE:
      newState.currentTile = action.payload;
      return newState;

    case SET_FIELD:
      newState.memoField = [...action.payload];
      return newState;

    case TOGGLE_VALUE:
      newState.memoField = [...action.payload];
      return newState;

    case RESET_GAME:
      newState.memoField = [];
      newState.open = false;
      newState.currentTile = {};
      return newState;

    default:
      return state;
  }
}
