import moment from "moment";

import {
  UPDATE_FIELD,
  SET_TOTAL_BOMBS,
  SET_TOTAL_POINTS,
  SET_MULTIPLIER,
  SET_TOTAL_COINS,
  TILE_FLIPPED,
  BOMB_FLIPPED,
  LEVEL_WON,
  INCREASE_COINS,
  SET_OBTAINED_COINS,
  DISABLE_TILES,
  BEGIN_SECOND_CHANCE,
  CANCEL_SECOND_CHANCE,
  TILE_RESET,
  UNDISABLE_TILES,
  CLOSE_DAILY_MODAL,
  SET_DAILY_TIMER,
  TIMER_FLIP,
  TIMER_RESET,
  TIMER_RESET_CONFIRM,
  LOAD_TIMER,
  LOAD_TIMER_CONFIRM,
  FLIP_TILE_BACK
} from "./actionTypes";

import {
  allFieldSize,
  allBombs,
  allMultipliers as all
} from "../../config/boardConfig";
import store from "../store";
import { initializeMemoField, loadMemoField } from "./memoActions";
import { increaseUserCoins, reduceSpecialTicket } from "./userActions";
import {
  loadLevelProgress,
  clearProgress,
  setDailyTipToLocalStorage
} from "../../storage/ls";
import { setLevel, setDifficulty, setCoinsThisRun } from "./gameActions";

const shuffle = array => {
  var j, x, i;
  for (i = array.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = array[i];
    array[i] = array[j];
    array[j] = x;
  }
};

export const initializeBoard = (level, difficulty) => {
  return async dispatch => {
    const progress = await loadLevelProgress();
    if (progress === false) {
      dispatch(generateBoard(level, difficulty));
    } else {
      // LOAD IN PROGRESS
      if (progress.midGame) {
        // LOAD EVERYTHING
        dispatch(setLevel(progress.level));
        dispatch(setDifficulty(progress.difficulty));
        dispatch(setCoinsThisRun(progress.coinsThisRun));
        dispatch(updateField(progress.field));
        dispatch(setObtainedCoins(progress.obtainedCoins));
        dispatch(setMultipliers(progress.multipliers));
        dispatch(loadMemoField(progress.memoField));
        dispatch(setTimerFromSave(progress.timer));
      } else {
        // LOAD GAME RELATED STUFFZ AND GENERATE OTHER STUFF
        dispatch(setLevel(progress.level));
        dispatch(setDifficulty(progress.difficulty));
        dispatch(setCoinsThisRun(progress.coinsThisRun));
        dispatch(generateBoard(progress.level, progress.difficulty));
        dispatch(setTimerFromSave(progress.timer));
      }
      clearProgress();
    }
  };
};

const generateBoard = (level, difficulty) => {
  return dispatch => {
    // CREATE INITIAL BOARD
    const fieldSize = allFieldSize[level - 1];
    const allMultipliers = [...all];
    const field = [];

    let location = 1;
    for (let i = 0; i < fieldSize; i++) {
      const row = [];
      for (let j = 0; j < fieldSize; j++) {
        const tile = { type: "", value: "", location: location++ };
        row[j] = tile;
      }
      field[i] = row;
    }

    // PLACE BOMBS
    const bombs = allBombs[level - 1][difficulty < 3 ? 0 : 1];
    const bombLocations = [];

    do {
      const random = Math.floor(
        Math.random() * Math.floor(fieldSize * fieldSize) + 1
      );
      if (bombLocations.findIndex(location => random === location) === -1) {
        bombLocations.push(random);
      }
    } while (bombLocations.length < bombs);

    bombLocations.sort((a, b) => a - b);

    bombLocations.forEach(location => {
      field.forEach(row => {
        const index = row.findIndex(tile => tile.location === location);
        if (index !== -1) row[index].type = "bomb";
      });
    });

    // PLACE MULTIPLIERS

    let addOn = [];
    let multipliers = [];
    let multiplierLocations = [];

    if (level === 1) {
      multipliers = [...allMultipliers[0][0]];
    } else if (level === 2) {
      multipliers = [
        ...allMultipliers[1][
          Math.floor(Math.random() * allMultipliers[1].length)
        ]
      ];
    } else {
      multipliers = [
        ...allMultipliers[1][
          Math.floor(Math.random() * allMultipliers[1].length)
        ]
      ];
      addOn = [...allMultipliers[level - 1]];
      addOn.forEach(multi => {
        multipliers.push(multi);
      });
      addOn = [];
    }

    do {
      const random = Math.floor(
        Math.random() * Math.floor(fieldSize * fieldSize) + 1
      );
      if (
        multiplierLocations.findIndex(location => random === location) === -1 &&
        bombLocations.findIndex(location => random === location) === -1
      ) {
        multiplierLocations.push(random);
      }
    } while (multiplierLocations.length < multipliers.length);

    multiplierLocations.sort((a, b) => a - b);
    shuffle(multipliers);

    multiplierLocations.forEach((location, locationIndex) => {
      field.forEach(row => {
        const index = row.findIndex(tile => tile.location === location);
        if (index !== -1) {
          row[index].type = "points";
          row[index].value = multipliers[locationIndex];
        }
      });
    });

    // PLACE REMAINING ONES
    field.forEach(row => {
      row.forEach(tile => {
        if (tile.type === "") {
          tile.type = "points";
          tile.value = 1;
        }
        tile.clicked = false;
      });
    });

    // CALCULATE TOTAL POINTS ON THE BOARD
    // CALCULATE TOTAL RECEIVABLE COINS
    let totalPoints = 0;
    let totalCoins = 1;
    field.forEach(row => {
      row.forEach(tile => {
        if (tile.type === "points") {
          totalPoints = totalPoints + tile.value;
          totalCoins = totalCoins * tile.value;
        }
      });
    });

    if (difficulty === 1 && checkForEmptyShitcoin(field)) {
      multipliers = [];
      dispatch(generateBoard(level, difficulty));
    } else {
      dispatch(updateField(field));
      dispatch(setTotalBombs(bombs));
      dispatch(setTotalPoints(totalPoints));
      dispatch(setTotalCoins(totalCoins));
      dispatch(setObtainedCoins(1));
      dispatch(setMultipliers(multipliers));
      dispatch(initializeMemoField(field));
    }
  };
};

const checkForEmptyShitcoin = field => {
  let bombFound = true;
  field.forEach(row => {
    if (bombFound) {
      const values = row.map(tile => {
        return tile.type === "bomb";
      });
      const indexBomb = values.findIndex(bomb => bomb === true);
      if (indexBomb === -1 && bombFound) {
        bombFound = false;
      }
    }
  });
  return bombFound;
};

export const updateField = field => {
  return { type: UPDATE_FIELD, payload: field };
};

export const setTotalBombs = bombs => {
  return { type: SET_TOTAL_BOMBS, payload: bombs };
};

export const setTotalPoints = points => {
  return { type: SET_TOTAL_POINTS, payload: points };
};

export const setObtainedCoins = coins => {
  return { type: SET_OBTAINED_COINS, payload: coins };
};

export const setMultipliers = multipliers => {
  return { type: SET_MULTIPLIER, payload: multipliers };
};

export const setTotalCoins = coins => {
  return { type: SET_TOTAL_COINS, payload: coins };
};

export const flip = tile => {
  return dispatch => {
    dispatch(flipTileValue(tile));
    dispatch(manageCoins(tile));
    dispatch(checkEndOfGame(tile));
  };
};

const flipTileValue = tile => {
  return { type: TILE_FLIPPED, payload: tile };
};

const resetTileValue = tile => {
  return { type: TILE_RESET, payload: tile };
};

const flipTileBack = tile => {
  return { type: FLIP_TILE_BACK, payload: tile };
};

export const flipAllTilesBack = () => {
  return dispatch => {
    const { field } = store.getState().board;
    field.forEach(row => {
      row.forEach(tile => {
        dispatch(flipTileBack(tile));
      });
    });
  };
};

const manageCoins = tile => {
  return dispatch => {
    if (tile.type === "points") {
      if (tile.value === 1) {
        dispatch({
          type: INCREASE_COINS,
          payload: { incType: "plus", amount: tile.value }
        });
      } else {
        dispatch({
          type: INCREASE_COINS,
          payload: { incType: "multiply", amount: tile.value }
        });
      }
    }
  };
};

export const cancelSecondChance = () => {
  return dispatch => {
    const { coinsThisRun } = store.getState().game;
    dispatch({ type: CANCEL_SECOND_CHANCE, payload: false });
    dispatch(flipTimer());
    dispatch(increaseUserCoins(coinsThisRun));
    dispatch(flipAllTiles());
    setTimeout(() => {
      dispatch({ type: BOMB_FLIPPED });
    }, 3000);
  };
};

export const continueSecondChance = () => {
  return dispatch => {
    const { specialTickets } = store.getState().user;
    const { lastTileFlipped } = store.getState().board;

    if (specialTickets > 0) {
      dispatch(resetTileValue(lastTileFlipped));
      dispatch({ type: CANCEL_SECOND_CHANCE, payload: true });
      dispatch({ type: UNDISABLE_TILES });
      dispatch(reduceSpecialTicket());
    } else {
      // ASK TO BUY SPECIAL TICKETS
    }
  };
};

const checkEndOfGame = tile => {
  return dispatch => {
    if (
      tile.type === "bomb" ||
      (store.getState().game.difficulty === 3 &&
        tile.type === "points" &&
        tile.value === 1)
    ) {
      // 50% of second chance
      const { secondChanceUsed } = store.getState().game.endGame;
      const chance = Math.round(Math.random());
      if (
        chance === 1 &&
        !secondChanceUsed &&
        store.getState().game.level !== 1
      ) {
        dispatch({ type: DISABLE_TILES, payload: false });
        setTimeout(() => {
          dispatch({ type: BEGIN_SECOND_CHANCE });
        }, 2000);
      } else {
        const { coinsThisRun } = store.getState().game;
        dispatch(flipTimer());
        dispatch(increaseUserCoins(coinsThisRun));
        dispatch({ type: DISABLE_TILES, payload: false });
        setTimeout(() => {
          dispatch(flipAllTiles());
        }, 2000);
        setTimeout(() => {
          dispatch({ type: BOMB_FLIPPED });
        }, 5000);
      }
    }

    const field = store.getState().board.field;
    const multipliers = store.getState().board.multipliers;
    const found = [];

    field.forEach(row => {
      row.forEach(tile => {
        if (tile.clicked && tile.type === "points" && tile.value !== 1) {
          found.push(tile.value);
        }
      });
    });

    if (multipliers.length === found.length) {
      dispatch(flipTimer());
      dispatch({ type: DISABLE_TILES, payload: true });
      setTimeout(() => {
        dispatch({ type: LEVEL_WON });
      }, 2000);
    }
  };
};

export const flipAllTiles = () => {
  return dispatch => {
    const { field } = store.getState().board;
    field.forEach(row => {
      row.forEach(tile => {
        setTimeout(() => {
          dispatch(flipTileValue(tile));
        }, 50 * tile.location);
      });
    });
  };
};

export const resetLevel = () => {
  return dispatch => {
    const { field } = store.getState().board;
    const fieldReset = field.map(row => {
      return row.map(tile => {
        return { ...tile, clicked: false };
      });
    });
    dispatch(updateField(fieldReset));
    dispatch(initializeMemoField(fieldReset));
  };
};

export const continueDailyTip = (free, choice) => {
  return dispatch => {
    const { specialTickets } = store.getState().user;
    if (!free && specialTickets < 1) {
      return null;
    }
    dispatch({ type: DISABLE_TILES, payload: false });
    const randomTile = chooseRandomTile(choice);
    dispatch({ type: CLOSE_DAILY_MODAL });
    if (free) {
      setDailyTipToLocalStorage(moment().valueOf());
      dispatch({ type: SET_DAILY_TIMER, payload: moment().valueOf() });
    } else {
      dispatch(reduceSpecialTicket());
    }
    dispatch(flipTileValue(randomTile));
    setTimeout(() => {
      dispatch(resetTileValue(randomTile));
      dispatch({ type: UNDISABLE_TILES });
    }, 2000);
  };
};

//true === points
const chooseRandomTile = choice => {
  const { field } = store.getState().board;
  const locations = [];
  field.forEach(row => {
    row.forEach(tile => {
      if (
        tile.type === "points" &&
        tile.value !== 1 &&
        !tile.clicked &&
        choice
      ) {
        locations.push(tile.location);
      } else if (tile.type === "bomb" && !tile.clicked && !choice) {
        locations.push(tile.location);
      }
    });
  });

  const randomLocation = Math.floor(Math.random() * locations.length);
  return { location: locations[randomLocation] };
};

export const flipTimer = () => {
  return { type: TIMER_FLIP };
};

export const resetTimer = () => {
  return { type: TIMER_RESET };
};

export const confirmResetTimer = () => {
  return { type: TIMER_RESET_CONFIRM };
};

const setTimerFromSave = timer => {
  return { type: LOAD_TIMER, payload: timer };
};

export const confirmLoadTimer = () => {
  return { type: LOAD_TIMER_CONFIRM };
};
