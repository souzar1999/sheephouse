export const OPEN_MENU = "OPEN_MENU";
export const CLOSE_MENU = "CLOSE_MENU";
export const USER_LOGIN = "USER_LOGIN";
export const USER_LOGOUT = "USER_LOGOUT";

export const openMenu = () => ({
  type: OPEN_MENU
});

export const closeMenu = () => ({
  type: CLOSE_MENU
});

export const userLogin = ({ userToken, refreshToken }) => ({
  type: USER_LOGIN,
  userToken,
  refreshToken
});

export const userLogout = () => ({
  type: USER_LOGOUT
});
