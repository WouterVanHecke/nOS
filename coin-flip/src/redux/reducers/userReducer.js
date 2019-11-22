import {
  PLAY_AS_GUEST,
  INCREASE_USER_COINS,
  GET_USER_SESSION,
  GET_USER_COINS,
  INCREASE_SPECIAL_TICKETS,
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
} from "../actions/actionTypes";

const initialState = {
  authenticated: false,
  chosenMethod: null,
  totalCoins: 0,
  specialTickets: 0,
  loginBonusFirstTime: false,
  holdingScore: 0,
  username: "",
  email: "",
  mouse: false,
  tempMouse: true
};

export default function user(state = initialState, action) {
  const newState = { ...state };

  switch (action.type) {
    case PLAY_AS_GUEST:
      newState.authenticated = true;
      newState.chosenMethod = "guest";
      return newState;

    case LOGGED_IN:
      newState.authenticated = true;
      newState.chosenMethod = "login";
      return newState;

    case INCREASE_USER_COINS:
      newState.totalCoins = state.totalCoins + action.payload;
      return newState;

    case INCREASE_SPECIAL_TICKETS:
      newState.specialTickets = state.specialTickets + action.payload;
      return newState;

    case GET_USER_SESSION:
      newState.authenticated = action.payload.authenticated;
      newState.chosenMethod = action.payload.chosenMethod;
      newState.username = action.payload.username;
      newState.email = action.payload.email;
      return newState;

    case GET_USER_COINS:
      newState.totalCoins = action.payload;
      return newState;

    case GET_SPECIAL_TICKETS:
      newState.specialTickets = action.payload;
      return newState;

    case REDUCE_SPECIAL_TICKET:
      newState.specialTickets = state.specialTickets - 1;
      return newState;

    case CLOSE_BONUS_MODAL:
      newState.loginBonusFirstTime = false;
      return newState;

    case GET_FIRST_TIME:
      newState.loginBonusFirstTime = action.payload;
      return newState;

    case SET_USER_INFO:
      newState.holdingScore = action.payload.holdingScore;
      newState.username = action.payload.username;
      newState.email = action.payload.email;
      return newState;

    case BUY_MOUSE:
      newState.mouse = true;
      newState.totalCoins = action.payload;
      return newState;

    case INCREASE_SPECIAL_TICKET:
      newState.specialTickets = action.payload.sp;
      newState.totalCoins = action.payload.coins;
      return newState;

    case ENABLE_TEMP_MOUSE:
      newState.tempMouse = true;
      return newState;

    case DISABLE_TEMP_MOUSE:
      newState.tempMouse = false;
      return newState;

    default:
      return state;
  }
}
