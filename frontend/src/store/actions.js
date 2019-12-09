export const OPEN_MENU = "OPEN_MENU";
export const CLOSE_MENU = "CLOSE_MENU";
export const USER_LOGIN = "USER_LOGIN";
export const USER_LOGOUT = "USER_LOGOUT";
export const USER_ADMIN = "USER_ADMIN";

export const openMenu = () => ({
  type: OPEN_MENU
});

export const closeMenu = () => ({
  type: CLOSE_MENU
});

export const userLogin = () => ({
  type: USER_LOGIN
});

export const userLogout = () => ({
  type: USER_LOGOUT
});

export const userAdmin = () => ({
  type: USER_ADMIN
});
