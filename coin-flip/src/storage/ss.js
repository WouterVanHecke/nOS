// USER
export const setUserInformationToSessionStorage = (
  authenticated,
  chosenMethod,
  username = "",
  email = ""
) => {
  sessionStorage.setItem(
    "userInfo",
    JSON.stringify({ authenticated, chosenMethod, username, email })
  );
};

export const getUserInformationFromSessionStorage = () => {
  return JSON.parse(sessionStorage.getItem("userInfo"));
};

export const clearUserInformation = () => {
  sessionStorage.clear();
};

export const setUserStateInSessionStorage = state => {
  sessionStorage.setItem("userState", JSON.stringify({ state }));
};

export const getUserStateInSessionStorage = () => {
  return JSON.parse(sessionStorage.getItem("userState")).state;
};

export const setUserAccesTokenInSessionStorage = token => {
  sessionStorage.setItem("accesToken", JSON.stringify({ token }));
};

export const getUserAccesTokenInSessionStorage = () => {
  return JSON.parse(sessionStorage.getItem("accesToken")).token;
};
