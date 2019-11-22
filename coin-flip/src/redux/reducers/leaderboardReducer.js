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

const initialState = {
  personal: {
    easy: {
      initiated: 0,
      completed: 0,
      times: []
    },
    normal: {
      initiated: 0,
      completed: 0,
      times: []
    },
    expert: {
      initiated: 0,
      completed: 0,
      times: []
    }
  },
  global: {
    easy: [],
    normal: [],
    expert: []
  }
};

export default function leaderboard(state = initialState, action) {
  const newState = { ...state };

  switch (action.type) {
    case LOAD_EASY_PERSONAL:
      newState.personal = { ...state.personal, easy: action.payload };
      return newState;

    case LOAD_NORMAL_PERSONAL:
      newState.personal = { ...state.personal, normal: action.payload };
      return newState;

    case LOAD_EXPERT_PERSONAL:
      newState.personal = { ...state.personal, expert: action.payload };
      return newState;

    case LOAD_EASY_GLOBAL:
      newState.global = { ...state.global, easy: action.payload };
      return newState;

    case LOAD_NORMAL_GLOBAL:
      newState.global = { ...state.global, normal: action.payload };
      return newState;

    case LOAD_EXPERT_GLOBAL:
      newState.global = { ...state.global, expert: action.payload };
      return newState;

    case INCREASE_COMPLETE_EASY:
      newState.personal = {
        ...state.personal,
        easy: {
          ...state.personal.easy,
          completed: state.personal.easy.completed + 1
        }
      };
      return newState;

    case INCREASE_COMPLETE_NORMAL:
      newState.personal = {
        ...state.personal,
        normal: {
          ...state.personal.normal,
          completed: state.personal.normal.completed + 1
        }
      };
      return newState;

    case INCREASE_COMPLETE_EXPERT:
      newState.personal = {
        ...state.personal,
        expert: {
          ...state.personal.expert,
          completed: state.personal.expert.completed + 1
        }
      };
      return newState;

    case INCREASE_INITIAL_EASY:
      newState.personal = {
        ...state.personal,
        easy: {
          ...state.personal.easy,
          initiated: state.personal.easy.initiated + 1
        }
      };
      return newState;

    case INCREASE_INITIAL_NORMAL:
      newState.personal = {
        ...state.personal,
        normal: {
          ...state.personal.normal,
          initiated: state.personal.normal.initiated + 1
        }
      };
      return newState;

    case INCREASE_INITIAL_EXPERT:
      newState.personal = {
        ...state.personal,
        expert: {
          ...state.personal.expert,
          initiated: state.personal.expert.initiated + 1
        }
      };
      return newState;

    default:
      return state;
  }
}
