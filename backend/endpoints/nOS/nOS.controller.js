const fetch = require("node-fetch");
const FormData = require("form-data");
const dotenv = require("dotenv");
dotenv.config();

import User from "./nOS.userModel";
import Leaderboard from "./nOS.leaderboardModel";

let leaderboardId = "ldb1";
let redirectUri = process.env.REDIRECT_URL;
let clientID = process.env.CLIENT_ID;
let clientSecret = process.env.CLIENT_SECRET;
if (process.env.NODE_ENV === "production") {
  redirectUri = process.env.REDIRECT_URL_PRODUCTION;
  clientID = process.env.CLIENT_ID_PRODUCTION;
  clientSecret = process.env.CLIENT_SECRET_PRODUCTION;
}

setTimeout(async () => {
  if ((await Leaderboard.getByLeaderboardID(leaderboardId)) === null) {
    const mongoLeaderboard = new Leaderboard({
      leaderboardID: leaderboardId,
      easy: JSON.stringify({
        times: []
      }),
      normal: JSON.stringify({
        times: []
      }),
      expert: JSON.stringify({
        times: []
      })
    });
    await mongoLeaderboard.save();
    console.log("New leaderboard created");
  }
}, 3000);

const getAccessToken = async (req, res, next) => {
  console.log("getAccessToken called");
  const { code } = req.body;

  let formData = new FormData();
  formData.append("code", code);
  formData.append("grant_type", "authorization_code");
  formData.append("redirect_uri", redirectUri);
  formData.append("client_id", clientID);
  formData.append("client_secret", clientSecret);

  const result = await fetch("https://nos.app/oauth/token", {
    method: "POST",
    body: formData
  });

  const { access_token } = await result.json();
  const userInfo = await fetch(
    `https://nos.app/api/v1/user/info?access_token=${access_token}`
  );

  const { holding_score, username, email } = await userInfo.json();
  await InitiateNewUser(email, username);

  res.json({
    accessToken: access_token,
    holdingScore: holding_score,
    username,
    email
  });
};

const InitiateNewUser = async (email, username) => {
  const user = {
    username,
    coins: 0,
    specialTickets: 0,
    tutorialDone: false,
    saveFile: false,
    dailyTipTimer: null,
    leaderboard: {
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
    firstLogin: true,
    mouse: false
  };

  if ((await User.getByEmail(email)) === null) {
    const mongoUser = new User({
      email,
      user: JSON.stringify(user)
    });
    await mongoUser.save();
  }
};

const getCoins = async (req, res, next) => {
  const { email } = req.body;
  const userObj = await User.getByEmail(email);

  if (userObj === null) {
    res.json({ coins: 0 });
    return;
  }

  const user = JSON.parse(userObj.user);
  res.json({ coins: user.coins });
};

const setCoins = async (req, res, next) => {
  const { email, coins } = req.body;
  const userObj = await User.getByEmail(email);

  if (userObj !== null) {
    const user = JSON.parse(userObj.user);
    user.coins = coins;
    await User.updateOne({ email }, { user: JSON.stringify(user) });
    res.send("OK");
    return;
  }

  res.end();
};

const getTickets = async (req, res, next) => {
  const { email } = req.body;
  const userObj = await User.getByEmail(email);

  if (userObj === null) {
    res.json({ tickets: 0 });
    return;
  }

  const user = JSON.parse(userObj.user);
  res.json({ tickets: user.specialTickets });
};

const setTickets = async (req, res, next) => {
  const { email, tickets } = req.body;
  const userObj = await User.getByEmail(email);

  if (userObj !== null) {
    const user = JSON.parse(userObj.user);
    user.specialTickets = tickets;
    await User.updateOne({ email }, { user: JSON.stringify(user) });
    res.send("OK");
    return;
  }

  res.end();
};

const setTutorial = async (req, res, next) => {
  const { email } = req.body;
  const userObj = await User.getByEmail(email);

  if (userObj !== null) {
    const user = JSON.parse(userObj.user);
    user.tutorialDone = true;
    await User.updateOne({ email }, { user: JSON.stringify(user) });
    res.send("OK");
    return;
  }

  res.end();
};

const getTutorial = async (req, res, next) => {
  const { email } = req.body;
  const userObj = await User.getByEmail(email);

  if (userObj === null) {
    res.json({ tutorial: false });
    return;
  }

  const user = JSON.parse(userObj.user);
  res.json({ tutorial: user.tutorialDone });
};

const saveLevel = async (req, res, next) => {
  const { email, level } = req.body;
  const userObj = await User.getByEmail(email);

  if (userObj !== null) {
    const user = JSON.parse(userObj.user);
    user.saveFile = level;
    await User.updateOne({ email }, { user: JSON.stringify(user) });
    res.send("OK");
    return;
  }

  res.end();
};

const loadLevel = async (req, res, next) => {
  const { email } = req.body;
  const userObj = await User.getByEmail(email);

  if (userObj === null) {
    res.json({ progress: false });
    return;
  }

  const user = JSON.parse(userObj.user);
  res.json({ progress: user.saveFile });
};

const clearProgress = async (req, res, next) => {
  const { email } = req.body;
  const userObj = await User.getByEmail(email);

  if (userObj !== null) {
    const user = JSON.parse(userObj.user);
    user.saveFile = false;
    await User.updateOne({ email }, { user: JSON.stringify(user) });
    res.send("OK");
    return;
  }

  res.end();
};

const hasProgress = async (req, res, next) => {
  const { email } = req.body;
  const userObj = await User.getByEmail(email);

  if (userObj === null) {
    res.json({ level: false });
    return;
  }

  const user = JSON.parse(userObj.user);
  res.json({
    level: user.saveFile === false ? user.saveFile : user.saveFile.level
  });
};

const setDailyTimer = async (req, res, next) => {
  const { email, timer } = req.body;
  const userObj = await User.getByEmail(email);

  if (userObj !== null) {
    const user = JSON.parse(userObj.user);
    user.dailyTipTimer = timer;
    await User.updateOne({ email }, { user: JSON.stringify(user) });
    res.send("OK");
    return;
  }

  res.end();
};

const getDailyTimer = async (req, res, next) => {
  const { email } = req.body;
  const userObj = await User.getByEmail(email);

  if (userObj === null) {
    res.json({ timer: null });
    return;
  }

  const user = JSON.parse(userObj.user);
  res.json({ timer: user.dailyTipTimer });
};

const setFirstBonus = async (req, res, next) => {
  const { email, value } = req.body;
  const userObj = await User.getByEmail(email);

  if (userObj !== null) {
    const user = JSON.parse(userObj.user);
    user.firstLogin = value;
    await User.updateOne({ email }, { user: JSON.stringify(user) });
    res.send("OK");
    return;
  }

  res.end();
};

const getFirstBonus = async (req, res, next) => {
  const { email } = req.body;
  const userObj = await User.getByEmail(email);

  if (userObj === null) {
    res.json({ value: null });
    return;
  }

  const user = JSON.parse(userObj.user);
  res.json({ value: user.firstLogin });
};

const setMouse = async (req, res, next) => {
  const { email } = req.body;
  const userObj = await User.getByEmail(email);

  if (userObj !== null) {
    const user = JSON.parse(userObj.user);
    user.mouse = true;
    await User.updateOne({ email }, { user: JSON.stringify(user) });
    res.send("OK");
    return;
  }

  res.end();
};

const getMouse = async (req, res, next) => {
  const { email } = req.body;
  const userObj = await User.getByEmail(email);

  if (userObj === null) {
    res.json({ mouse: null });
    return;
  }

  const user = JSON.parse(userObj.user);
  res.json({ mouse: user.mouse });
};

const setEasy = async (req, res, next) => {
  const { email, easy } = req.body;
  const userObj = await User.getByEmail(email);

  if (userObj !== null) {
    const user = JSON.parse(userObj.user);
    user.leaderboard.easy = easy;
    checkForEasyGlobalLeaderboard(email, easy);
    await User.updateOne({ email }, { user: JSON.stringify(user) });
    res.send("OK");
    return;
  }

  res.end();
};

const setNormal = async (req, res, next) => {
  const { email, normal } = req.body;
  const userObj = await User.getByEmail(email);

  if (userObj !== null) {
    const user = JSON.parse(userObj.user);
    user.leaderboard.normal = normal;
    checkForNormalGlobalLeaderboard(email, normal);
    await User.updateOne({ email }, { user: JSON.stringify(user) });
    res.send("OK");
    return;
  }

  res.end();
};

const setExpert = async (req, res, next) => {
  const { email, expert } = req.body;
  const userObj = await User.getByEmail(email);

  if (userObj !== null) {
    const user = JSON.parse(userObj.user);
    user.leaderboard.expert = expert;
    checkForExpertGlobalLeaderboard(email, expert);
    await User.updateOne({ email }, { user: JSON.stringify(user) });
    res.send("OK");
    return;
  }

  res.end();
};

const getEasy = async (req, res, next) => {
  const { email } = req.body;
  const userObj = await User.getByEmail(email);

  if (userObj === null) {
    res.json({ easy: null });
    return;
  }

  const user = JSON.parse(userObj.user);
  res.json({ easy: user.leaderboard.easy });
};

const getNormal = async (req, res, next) => {
  const { email } = req.body;
  const userObj = await User.getByEmail(email);

  if (userObj === null) {
    res.json({ normal: null });
    return;
  }

  const user = JSON.parse(userObj.user);
  res.json({ normal: user.leaderboard.normal });
};

const getExpert = async (req, res, next) => {
  const { email } = req.body;
  const userObj = await User.getByEmail(email);

  if (userObj === undefined) {
    res.json({ expert: null });
    return;
  }

  const user = JSON.parse(userObj.user);
  res.json({ expert: user.leaderboard.expert });
};

const checkForEasyGlobalLeaderboard = async (email, easyObj) => {
  const { completed, times } = easyObj;
  const leaderboardObj = await Leaderboard.getByLeaderboardID(leaderboardId);
  const userObj = await User.getByEmail(email);
  const easy = JSON.parse(leaderboardObj.easy);
  const user = JSON.parse(userObj.user);

  if (completed !== 0) {
    // check if the user already has a record (with index!)
    let index = -1;
    for (let i = 0; i < easy.times.length; i++) {
      const element = easy.times[i];
      if (element.email === user.username) {
        index = i;
      }
    }
    if (index === -1) {
      easy.times.push({
        email: user.username,
        completed: easyObj.completed
      });
    } else {
      easy.times[index] = {
        ...easy.times[index],
        completed: easyObj.completed
      };
    }

    await Leaderboard.updateOne(
      { leaderboardID: leaderboardId },
      { easy: JSON.stringify(easy) }
    );
  }

  if (times.length !== 0) {
    // check if the user already has a record (with index!)
    let index = -1;
    for (let i = 0; i < easy.times.length; i++) {
      const element = easy.times[i];
      if (element.email === user.username) {
        index = i;
      }
    }
    if (index === -1) {
      easy.times.push({
        email: user.username,
        time: easyObj.times.sort((a, b) => a - b)[0]
      });
    } else {
      easy.times[index] = {
        ...easy.times[index],
        time: easyObj.times.sort((a, b) => a - b)[0]
      };
    }

    await Leaderboard.updateOne(
      { leaderboardID: leaderboardId },
      { easy: JSON.stringify(easy) }
    );
  }
};

const checkForNormalGlobalLeaderboard = async (email, normalObj) => {
  const { completed, times } = normalObj;
  const leaderboardObj = await Leaderboard.getByLeaderboardID(leaderboardId);
  const normal = JSON.parse(leaderboardObj.normal);
  const userObj = await User.getByEmail(email);
  const user = JSON.parse(userObj.user);

  if (completed !== 0) {
    // check if the user already has a record (with index!)
    let index = -1;
    for (let i = 0; i < normal.times.length; i++) {
      const element = normal.times[i];
      if (element.email === user.username) {
        index = i;
      }
    }
    if (index === -1) {
      normal.times.push({
        email: user.username,
        completed: normalObj.completed
      });
    } else {
      normal.times[index] = {
        ...normal.times[index],
        completed: normalObj.completed
      };
    }

    await Leaderboard.updateOne(
      { leaderboardID: leaderboardId },
      { normal: JSON.stringify(normal) }
    );
  }

  if (times.length !== 0) {
    // check if the user already has a record (with index!)
    let index = -1;
    for (let i = 0; i < normal.times.length; i++) {
      const element = normal.times[i];
      if (element.email === user.username) {
        index = i;
      }
    }
    if (index === -1) {
      normal.times.push({
        email: user.username,
        time: normalObj.times.sort((a, b) => a - b)[0]
      });
    } else {
      normal.times[index] = {
        ...normal.times[index],
        time: normalObj.times.sort((a, b) => a - b)[0]
      };
    }

    await Leaderboard.updateOne(
      { leaderboardID: leaderboardId },
      { normal: JSON.stringify(normal) }
    );
  }
};

const checkForExpertGlobalLeaderboard = async (email, expertObj) => {
  const { completed, times } = expertObj;
  const leaderboardObj = await Leaderboard.getByLeaderboardID(leaderboardId);
  const expert = JSON.parse(leaderboardObj.expert);
  const userObj = await User.getByEmail(email);
  const user = JSON.parse(userObj.user);

  if (completed !== 0) {
    // check if the user already has a record (with index!)
    let index = -1;
    for (let i = 0; i < expert.times.length; i++) {
      const element = expert.times[i];
      if (element.email === user.username) {
        index = i;
      }
    }
    if (index === -1) {
      expert.times.push({
        email: user.username,
        completed: expertObj.completed
      });
    } else {
      expert.times[index] = {
        ...expert.times[index],
        completed: expertObj.completed
      };
    }

    await Leaderboard.updateOne(
      { leaderboardID: leaderboardId },
      { expert: JSON.stringify(expert) }
    );
  }

  if (times.length !== 0) {
    // check if the user already has a record (with index!)
    let index = -1;
    for (let i = 0; i < expert.times.length; i++) {
      const element = expert.times[i];
      if (element.email === user.username) {
        index = i;
      }
    }
    if (index === -1) {
      expert.times.push({
        email: user.username,
        time: expertObj.times.sort((a, b) => a - b)[0]
      });
    } else {
      expert.times[index] = {
        ...expert.times[index],
        time: expertObj.times.sort((a, b) => a - b)[0]
      };
    }

    await Leaderboard.updateOne(
      { leaderboardID: leaderboardId },
      { expert: JSON.stringify(expert) }
    );
  }
};

const getEasyGlobal = async (req, res, next) => {
  const leaderboardObj = await Leaderboard.getByLeaderboardID(leaderboardId);

  if (leaderboardObj === null) {
    res.json({ easy: null });
    return;
  }

  const easy = JSON.parse(leaderboardObj.easy);
  res.json({ easy: easy.times });
};

const getNormalGlobal = async (req, res, next) => {
  const leaderboardObj = await Leaderboard.getByLeaderboardID(leaderboardId);

  if (leaderboardObj === null) {
    res.json({ normal: null });
    return;
  }

  const normal = JSON.parse(leaderboardObj.normal);
  res.json({ normal: normal.times });
};

const getExpertGlobal = async (req, res, next) => {
  const leaderboardObj = await Leaderboard.getByLeaderboardID(leaderboardId);

  if (leaderboardObj === null) {
    res.json({ expert: null });
    return;
  }

  const expert = JSON.parse(leaderboardObj.expert);
  res.json({ expert: expert.times });
};

export default {
  getAccessToken,
  getCoins,
  setCoins,
  getTickets,
  setTickets,
  setTutorial,
  getTutorial,
  saveLevel,
  loadLevel,
  clearProgress,
  hasProgress,
  setDailyTimer,
  getDailyTimer,
  setFirstBonus,
  getFirstBonus,
  setMouse,
  getMouse,
  setEasy,
  setNormal,
  setExpert,
  getEasy,
  getNormal,
  getExpert,
  getEasyGlobal,
  getNormalGlobal,
  getExpertGlobal
};
