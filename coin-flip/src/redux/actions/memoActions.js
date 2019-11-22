import {
  TOGGLE_MEMO,
  SET_FIELD,
  SET_CURRENT_TILE,
  TOGGLE_VALUE
} from "../actions/actionTypes";

export const toggleMemo = () => {
  return { type: TOGGLE_MEMO };
};

export const setCurrentTile = tile => {
  return { type: SET_CURRENT_TILE, payload: tile };
};

export const initializeMemoField = field => {
  return dispatch => {
    const memoField = field.map(row => {
      return row.map(tile => {
        return {
          location: tile.location,
          memo: { one: false, two: false, three: false, shitcoin: false }
        };
      });
    });
    dispatch({ type: SET_FIELD, payload: memoField });
  };
};

export const loadMemoField = memoField => {
  return { type: SET_FIELD, payload: memoField };
};

export const toggleMemoValue = (location, value, field) => {
  return dispatch => {
    const memoField = field.map(row => {
      return row.map(tile => {
        if (tile.location !== location) {
          return tile;
        }

        return {
          ...tile,
          memo: {
            ...tile.memo,
            one: value === 1 ? !tile.memo.one : tile.memo.one,
            two: value === 2 ? !tile.memo.two : tile.memo.two,
            three: value === 3 ? !tile.memo.three : tile.memo.three,
            shitcoin: value === "sc" ? !tile.memo.shitcoin : tile.memo.shitcoin
          }
        };
      });
    });
    dispatch({ type: TOGGLE_VALUE, payload: memoField });
  };
};
