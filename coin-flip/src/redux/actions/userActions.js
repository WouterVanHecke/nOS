import uuid from "uuid/v4";
import {
  PLAY_AS_GUEST,
  INCREASE_USER_COINS,
  GET_USER_SESSION,
  GET_USER_COINS,
  GET_SPECIAL_TICKETS,
  REDUCE_SPECIAL_TICKET,
  LOGGED_IN,
  CLOSE_BONUS_MODAL,
  GET_FIRST_TIME,
  SET_USER_INFO,
  BUY_MOUSE,
  INCREASE_SPECIAL_TICKET,
  ENABLE_TEMP_MOUSE,
  DISABLE_TEMP_MOUSE
} from "./actionTypes";
import {
  getUserInformationFromSessionStorage,
  setUserInformationToSessionStorage,
  setUserStateInSessionStorage,
  getUserStateInSessionStorage,
  setUserAccesTokenInSessionStorage
} from "../../storage/ss";
import {
  getUserCoinsFromLocalStorage,
  setUserCoinsToLocalStorage,
  getUserTicketsFromLocalStorage,
  reduceSpecialTicketToLocalStorage,
  increaseSpecialTicketToLocalStorage,
  setFirstBonusInLocalStorage,
  getFirstBonusFromLocalStorage,
  setUserTicketsToLocalStorage,
  setMouseBoughtToLocalStorage,
  getMouseBoughtToLocalStorage
} from "../../storage/ls";

import store from "../store";
import { initializeTutorial } from "./gameActions";
import { initializeLeaderboard } from "./leaderboardActions";

let nos;
let NOS, GAS, NEO;
const receiver = "AcJruxKgHd5aHk4AG6oKAzbPUhsRxUiY9Z";
if (window.NOS !== undefined) {
  nos = window.NOS.V1;
  NOS = "c9c0fc5a2b66a29d6b14601e752e6e1a445e088d";
  GAS = window.NOS.ASSETS.GAS;
  NEO = window.NOS.ASSETS.NEO;
}

export const playAsGuest = () => {
  return dispatch => {
    setUserInformationToSessionStorage(true, "guest");
    dispatch({ type: PLAY_AS_GUEST });
  };
};

export const register = params => {
  return async dispatch => {
    // const redirectUri = "http://localhost:3000"; //DEVELOPMENT
    const redirectUri = "http://nos.vanheckewouter.be"; //PRODUCTION
    // const clientID = "3eb4732eefd869fd609164183f6621af"; //DEVELOPMENT
    const clientID = "637e2b991801d4b81b0a30b7c30dcb06"; //PRODUCTION

    if (params === undefined) {
      const state = uuid();
      setUserStateInSessionStorage(state);
      const url =
        "http://nos.app/oauth/authorize?client_id=" +
        clientID +
        "&redirect_uri=" +
        redirectUri +
        "&state=" +
        state;
      window.location.replace(url);
    } else {
      const splitParams = params.split("&");
      const code = splitParams[0].split("=")[1];
      const state = splitParams[1].split("=")[1];
      if (state === getUserStateInSessionStorage()) {
        const result = await fetch(
          "https://nos-flip.herokuapp.com/nos/getAccessToken",
          // "http://localhost:3001/nos/getAccessToken",
          {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code })
          }
        );
        const {
          holdingScore,
          accessToken,
          username,
          email
        } = await result.json();
        setUserAccesTokenInSessionStorage(accessToken);
        setUserInformationToSessionStorage(true, "login", username, email);
        const { coins, sp } = calculateBonusses(holdingScore);
        dispatch({ type: LOGGED_IN });
        await dispatch({
          type: SET_USER_INFO,
          payload: {
            holdingScore,
            username,
            email
          }
        });
        await dispatch(initializeUser());
        if (store.getState().user.loginBonusFirstTime) {
          await dispatch(increaseUserCoins(coins));
          await dispatch(increaseUserSP(sp));
        }
        await dispatch(initializeTutorial());
        await dispatch(initializeLeaderboard());
        window.location.replace(redirectUri);
      }
    }
  };
};

const calculateBonusses = holdingScore => {
  let sp = Math.ceil(holdingScore / 10000);
  if (sp > 5) {
    sp = 5;
  } else if (sp === 0) {
    sp = 1;
  }

  let coins = Math.ceil(holdingScore / 1000);
  if (coins > 1000) {
    coins = 1000;
  } else if (coins === 0) {
    coins = 100;
  }

  return { coins, sp };
};

export const increaseUserCoins = coins => {
  return async dispatch => {
    await setUserCoinsToLocalStorage(store.getState().user.totalCoins + coins);
    dispatch({ type: INCREASE_USER_COINS, payload: coins });
  };
};

const increaseUserSP = sp => {
  return async dispatch => {
    await setUserTicketsToLocalStorage(
      store.getState().user.specialTickets + sp
    );
    dispatch({
      type: GET_SPECIAL_TICKETS,
      payload: store.getState().user.specialTickets + sp
    });
  };
};

export const reduceSpecialTicket = () => {
  return dispatch => {
    reduceSpecialTicketToLocalStorage();
    dispatch({ type: REDUCE_SPECIAL_TICKET });
  };
};

export const initializeUser = () => {
  return async dispatch => {
    const userInfo = await getUserInformationFromSessionStorage();
    if (userInfo !== null) {
      dispatch({ type: GET_USER_SESSION, payload: userInfo });
    }
    const userCoins = await getUserCoinsFromLocalStorage();
    if (userCoins !== null) {
      dispatch({ type: GET_USER_COINS, payload: userCoins });
    }
    const userTickets = await getUserTicketsFromLocalStorage();
    if (userTickets !== null) {
      dispatch({ type: GET_SPECIAL_TICKETS, payload: userTickets });
    }
    const firstTimeBonus = await getFirstBonusFromLocalStorage();
    if (firstTimeBonus !== null && firstTimeBonus === false) {
      dispatch({ type: GET_FIRST_TIME, payload: false });
    } else if (firstTimeBonus === true) {
      dispatch({ type: GET_FIRST_TIME, payload: true });
    }
    const mouse = await getMouseBoughtToLocalStorage();
    if (mouse !== null && mouse === true) {
      dispatch({ type: BUY_MOUSE, payload: userCoins });
    }
    await dispatch(initializeLeaderboard());
  };
};

export const closeBonusModal = () => {
  setFirstBonusInLocalStorage(false);
  return { type: CLOSE_BONUS_MODAL };
};

export const buyMouse = () => {
  return async dispatch => {
    const { totalCoins } = store.getState().user;
    if (totalCoins >= 500) {
      await setMouseBoughtToLocalStorage();
      await setUserCoinsToLocalStorage(totalCoins - 500);
      dispatch({ type: BUY_MOUSE, payload: totalCoins - 500 });
    }
  };
};

export const buySP = (currency, amount, asset = null) => {
  return async dispatch => {
    const { totalCoins, specialTickets } = store.getState().user;
    if (currency === "coins") {
      if (totalCoins >= 10000 * amount) {
        await increaseSpecialTicketToLocalStorage(amount);
        await setUserCoinsToLocalStorage(totalCoins - 10000 * amount);
        dispatch({
          type: INCREASE_SPECIAL_TICKET,
          payload: {
            sp: specialTickets + amount,
            coins: totalCoins - 10000 * amount
          }
        });
      }
    } else {
      let payAmount;
      if (asset === 10) {
        payAmount = 30 * amount;
      } else if (asset === 20) {
        payAmount = 0.3 * amount;
      } else {
        payAmount = 0.1 * amount;
      }

      nos
        .send({
          asset: asset === 10 ? NOS : asset === 20 ? GAS : NEO,
          amount: payAmount,
          receiver
        })
        .then(txid => {
          increaseSpecialTicketToLocalStorage(amount);
          dispatch({
            type: INCREASE_SPECIAL_TICKET,
            payload: {
              sp: specialTickets + amount,
              coins: totalCoins
            }
          });
        })
        .catch(err => alert(`Error: ${err.message}`));
    }
  };
};

export const enableTempMouse = () => {
  return { type: ENABLE_TEMP_MOUSE };
};

export const disableTempMouse = () => {
  return { type: DISABLE_TEMP_MOUSE };
};
