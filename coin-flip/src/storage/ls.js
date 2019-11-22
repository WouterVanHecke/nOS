import store from "../redux/store";
import { initializeUser } from "../redux/actions/userActions";
// const backendAddress = "http://localhost:3001/";
const backendAddress = "https://nos-flip.herokuapp.com/";
const getCoinsAddress = backendAddress + "nos/getCoins";
const setCoinsAddress = backendAddress + "nos/setCoins";
const getTicketsAddress = backendAddress + "nos/getTickets";
const setTicketsAddress = backendAddress + "nos/setTickets";
const setTutorialsAddress = backendAddress + "nos/setTutorial";
const getTutorialsAddress = backendAddress + "nos/getTutorial";
const saveLevelAddress = backendAddress + "nos/saveLevel";
const loadLevelAddress = backendAddress + "nos/loadLevel";
const clearProgressAddress = backendAddress + "nos/clearProgress";
const hasProgressAddress = backendAddress + "nos/hasProgress";
const setDailyTimerAddress = backendAddress + "nos/setDailyTimer";
const getDailyTimerAddress = backendAddress + "nos/getDailyTimer";
const setFirstBonusAddress = backendAddress + "nos/setFirstBonus";
const getFirstBonusAddress = backendAddress + "nos/getFirstBonus";
const setMouseAddress = backendAddress + "nos/setMouse";
const getMouseAddress = backendAddress + "nos/getMouse";
const setEasyAddress = backendAddress + "nos/setEasy";
const setNormalAddress = backendAddress + "nos/setNormal";
const setExpertAddress = backendAddress + "nos/setExpert";
const getEasyAddress = backendAddress + "nos/getEasy";
const getNormalAddress = backendAddress + "nos/getNormal";
const getExpertAddress = backendAddress + "nos/getExpert";
const getEasyGlobalAddress = backendAddress + "nos/getEasyGlobal";
const getNormalGlobalAddress = backendAddress + "nos/getNormalGlobal";
const getExpertGlobalAddress = backendAddress + "nos/getExpertGlobal";

// CLEAR
export const clear = () => {
  localStorage.clear();
};

// USER
// NEEDS BACKEND
export const getUserCoinsFromLocalStorage = async () => {
  if (store.getState().user.chosenMethod === "login") {
    const result = await fetch(getCoinsAddress, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: store.getState().user.email })
    });
    const res = await result.json();
    return res.coins;
  } else {
    const ls = await localStorage.getItem("coins");
    const coins = JSON.parse(ls);
    if (coins === null) {
      return null;
    }
    return coins.coins;
  }
};

// NEEDS BACKEND
export const setUserCoinsToLocalStorage = async coins => {
  if (store.getState().user.chosenMethod === "login") {
    await fetch(setCoinsAddress, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ coins, email: store.getState().user.email })
    });
  } else {
    await localStorage.setItem("coins", JSON.stringify({ coins }));
  }
};

// NEEDS BACKEND
export const getUserTicketsFromLocalStorage = async () => {
  if (store.getState().user.chosenMethod === "login") {
    const result = await fetch(getTicketsAddress, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: store.getState().user.email })
    });
    const res = await result.json();
    return res.tickets;
  } else {
    const ls = await localStorage.getItem("tickets");
    const tickets = JSON.parse(ls);
    if (tickets === null) {
      return null;
    }
    return tickets.tickets;
  }
};

// NEEDS BACKEND
export const setUserTicketsToLocalStorage = async tickets => {
  if (store.getState().user.chosenMethod === "login") {
    await fetch(setTicketsAddress, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tickets, email: store.getState().user.email })
    });
  } else {
    await localStorage.setItem("tickets", JSON.stringify({ tickets }));
  }
};

export const reduceSpecialTicketToLocalStorage = () => {
  const tickets = getUserTicketsFromLocalStorage();
  setUserTicketsToLocalStorage(tickets - 1);
};

export const increaseSpecialTicketToLocalStorage = amount => {
  const tickets = getUserTicketsFromLocalStorage();
  setUserTicketsToLocalStorage(tickets + amount);
};

// TUTORIAL
// NEEDS BACKEND
export const setTutorialDone = async () => {
  if (store.getState().user.chosenMethod === "login") {
    await fetch(setTutorialsAddress, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: store.getState().user.email
      })
    });
  } else {
    await localStorage.setItem("tutorial", JSON.stringify({ tutorial: true }));
  }
};

// NEEDS BACKEND
export const getTutorialDone = async () => {
  await initializeUser();
  if (store.getState().user.chosenMethod === "login") {
    const result = await fetch(getTutorialsAddress, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: store.getState().user.email })
    });
    const res = await result.json();
    return res.tutorial;
  } else {
    const ls = await localStorage.getItem("tutorial");
    const tutorial = JSON.parse(ls);
    if (tutorial === null) {
      return null;
    }
    return tutorial.tutorial;
  }
};

// SAVE PROGRESS
// NEEDS BACKEND
export const saveLevelProgress = async (
  midGame,
  level,
  difficulty,
  coinsThisRun,
  field,
  obtainedCoins,
  multipliers,
  memoField,
  timer
) => {
  if (store.getState().user.chosenMethod === "login") {
    await fetch(saveLevelAddress, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: store.getState().user.email,
        level: {
          midGame,
          level,
          difficulty,
          coinsThisRun,
          field,
          obtainedCoins,
          multipliers,
          memoField,
          timer
        }
      })
    });
  } else {
    await localStorage.setItem(
      "progress",
      JSON.stringify({
        midGame,
        level,
        difficulty,
        coinsThisRun,
        field,
        obtainedCoins,
        multipliers,
        memoField,
        timer
      })
    );
  }
};

// NEEDS BACKEND
export const loadLevelProgress = async () => {
  if (store.getState().user.chosenMethod === "login") {
    const result = await fetch(loadLevelAddress, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: store.getState().user.email })
    });
    const res = await result.json();
    return res.progress;
  } else {
    const ls = await localStorage.getItem("progress");
    const progress = JSON.parse(ls);
    if (progress === null) {
      return false;
    }
    return progress;
  }
};

// NEEDS BACKEND
export const clearProgress = async () => {
  if (store.getState().user.chosenMethod === "login") {
    await fetch(clearProgressAddress, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: store.getState().user.email
      })
    });
  } else {
    await localStorage.setItem("progress", null);
  }
};

// NEEDS BACKEND
export const hasProgress = async () => {
  await initializeUser();
  if (store.getState().user.chosenMethod === "login") {
    const result = await fetch(hasProgressAddress, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: store.getState().user.email })
    });
    const res = await result.json();
    return res.level;
  } else {
    const ls = await localStorage.getItem("progress");
    const progress = JSON.parse(ls);
    if (progress === null) {
      return false;
    }
    return progress.level;
  }
};

// DAILY TIP
// NEEDS BACKEND
export const setDailyTipToLocalStorage = async timer => {
  if (store.getState().user.chosenMethod === "login") {
    await fetch(setDailyTimerAddress, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: store.getState().user.email,
        timer
      })
    });
  } else {
    await localStorage.setItem("tip", JSON.stringify({ timer: timer }));
  }
};

// NEEDS BACKEND
export const getDailyTipFromLocalStorage = async () => {
  if (store.getState().user.chosenMethod === "login") {
    const result = await fetch(getDailyTimerAddress, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: store.getState().user.email })
    });
    const res = await result.json();
    return res.timer;
  } else {
    const ls = await localStorage.getItem("tip");
    const tip = JSON.parse(ls);
    if (tip === null) {
      return null;
    }
    return tip.timer;
  }
};

//LEADERBOARD
// NEEDS BACKEND
export const setPersonalEasyLeaderboard = async easy => {
  if (store.getState().user.chosenMethod === "login") {
    await fetch(setEasyAddress, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: store.getState().user.email,
        easy
      })
    });
  } else {
    await localStorage.setItem("easy", JSON.stringify({ easy }));
  }
};

// NEEDS BACKEND
export const getPersonalEasyLeaderboard = async () => {
  if (store.getState().user.chosenMethod === "login") {
    const result = await fetch(getEasyAddress, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: store.getState().user.email })
    });
    const res = await result.json();
    return res.easy;
  } else {
    const ls = await localStorage.getItem("easy");
    const easy = JSON.parse(ls);
    if (easy === null) {
      return null;
    }
    return easy.easy;
  }
};

// NEEDS BACKEND
export const setPersonalNormalLeaderboard = async normal => {
  if (store.getState().user.chosenMethod === "login") {
    await fetch(setNormalAddress, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: store.getState().user.email,
        normal
      })
    });
  } else {
    await localStorage.setItem("normal", JSON.stringify({ normal }));
  }
};

// NEEDS BACKEND
export const getPersonalNormalLeaderboard = async () => {
  if (store.getState().user.chosenMethod === "login") {
    const result = await fetch(getNormalAddress, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: store.getState().user.email })
    });
    const res = await result.json();
    return res.normal;
  } else {
    const ls = await localStorage.getItem("normal");
    const normal = JSON.parse(ls);
    if (normal === null) {
      return null;
    }
    return normal.normal;
  }
};

// NEEDS BACKEND
export const setPersonalExpertLeaderboard = async expert => {
  if (store.getState().user.chosenMethod === "login") {
    await fetch(setExpertAddress, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: store.getState().user.email,
        expert
      })
    });
  } else {
    await localStorage.setItem("expert", JSON.stringify({ expert }));
  }
};

// NEEDS BACKEND
export const getPersonalExpertLeaderboard = async () => {
  if (store.getState().user.chosenMethod === "login") {
    const result = await fetch(getExpertAddress, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: store.getState().user.email })
    });
    const res = await result.json();
    return res.expert;
  } else {
    const ls = await localStorage.getItem("expert");
    const expert = JSON.parse(ls);
    if (expert === null) {
      return null;
    }
    return expert.expert;
  }
};

// NEEDS BACKEND
export const getGlobalEasyLeaderboard = async () => {
  const result = await fetch(getEasyGlobalAddress, {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: store.getState().user.email })
  });
  const res = await result.json();
  return res.easy;
};

// NEEDS BACKEND
export const getGlobalNormalLeaderboard = async () => {
  const result = await fetch(getNormalGlobalAddress, {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: store.getState().user.email })
  });
  const res = await result.json();
  return res.normal;
};

// NEEDS BACKEND
export const getGlobalExpertLeaderboard = async () => {
  const result = await fetch(getExpertGlobalAddress, {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: store.getState().user.email })
  });
  const res = await result.json();
  return res.expert;
};

export const increaseInitiatedRunPersonalLeaderboard = async difficulty => {
  switch (difficulty) {
    case 1:
      const easy = await getPersonalEasyLeaderboard();
      if (easy === null) {
        await setPersonalEasyLeaderboard({
          initiated: 1,
          completed: 0,
          times: []
        });
      } else {
        await setPersonalEasyLeaderboard({
          ...easy,
          initiated: easy.initiated + 1
        });
      }
      break;

    case 2:
      const normal = await getPersonalNormalLeaderboard();
      if (normal === null) {
        await setPersonalNormalLeaderboard({
          initiated: 1,
          completed: 0,
          times: []
        });
      } else {
        await setPersonalNormalLeaderboard({
          ...normal,
          initiated: normal.initiated + 1
        });
      }
      break;

    case 3:
      const expert = await getPersonalExpertLeaderboard();
      if (expert === null) {
        await setPersonalExpertLeaderboard({
          initiated: 1,
          completed: 0,
          times: []
        });
      } else {
        await setPersonalExpertLeaderboard({
          ...expert,
          initiated: expert.initiated + 1
        });
      }
      break;

    default:
      break;
  }
};

export const increaseCompletedRunPersonalLeaderboard = async (
  difficulty,
  timer
) => {
  switch (difficulty) {
    case 1:
      const easy = await getPersonalEasyLeaderboard();
      await setPersonalEasyLeaderboard({
        ...easy,
        completed: easy.completed + 1,
        times: easy.times.length === 0 ? [timer] : [...easy.times, timer]
      });
      break;

    case 2:
      const normal = await getPersonalNormalLeaderboard();
      await setPersonalEasyLeaderboard({
        ...normal,
        completed: normal.completed + 1,
        times: normal.times.length === 0 ? [timer] : [...normal.times, timer]
      });
      break;

    case 3:
      const expert = await getPersonalExpertLeaderboard();
      await setPersonalEasyLeaderboard({
        ...expert,
        completed: expert.completed + 1,
        times: expert.times.length === 0 ? [timer] : [...expert.times, timer]
      });
      break;

    default:
      break;
  }
};

// FIRST TIME BONUS
// NEEDS BACKEND
export const setFirstBonusInLocalStorage = async value => {
  if (store.getState().user.chosenMethod === "login") {
    await fetch(setFirstBonusAddress, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: store.getState().user.email,
        value
      })
    });
  } else {
    await localStorage.setItem("firstTimeBonus", JSON.stringify({ value }));
  }
};

// NEEDS BACKEND
export const getFirstBonusFromLocalStorage = async () => {
  if (store.getState().user.chosenMethod === "login") {
    const result = await fetch(getFirstBonusAddress, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: store.getState().user.email })
    });
    const res = await result.json();
    return res.value;
  } else {
    const ls = await localStorage.getItem("firstTimeBonus");
    const bonus = JSON.parse(ls);
    if (bonus === null) {
      return null;
    }
    return bonus.value;
  }
};

// STORE
// NEEDS BACKEND
export const setMouseBoughtToLocalStorage = async () => {
  if (store.getState().user.chosenMethod === "login") {
    await fetch(setMouseAddress, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: store.getState().user.email
      })
    });
  } else {
    await localStorage.setItem("mouse", JSON.stringify({ mouse: true }));
  }
};

// NEEDS BACKEND
export const getMouseBoughtToLocalStorage = async () => {
  if (store.getState().user.chosenMethod === "login") {
    const result = await fetch(getMouseAddress, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: store.getState().user.email })
    });
    const res = await result.json();
    return res.mouse;
  } else {
    const ls = await localStorage.getItem("mouse");
    const mouse = JSON.parse(ls);
    if (mouse === null) {
      return null;
    }
    return mouse.mouse;
  }
};
