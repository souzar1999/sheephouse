import {
  OPEN_MENU,
  CLOSE_MENU,
  USER_LOGIN,
  USER_LOGOUT,
  USER_ADMIN
} from "./actions";

const appReducer = (
  state = {
    isMenuOpen: false,
    isUserLogged: false,
    isUserAdmin: false
  },
  action
) => {
  switch (action.type) {
    case CLOSE_MENU: {
      return {
        ...state,
        isMenuOpen: false
      };
    }
    case OPEN_MENU: {
      return {
        ...state,
        isMenuOpen: true
      };
    }
    case USER_LOGIN: {
      return {
        ...state,
        isUserLogged: true
      };
    }
    case USER_LOGOUT: {
      return {
        ...state,
        isUserLogged: false,
        isUserAdmin: false
      };
    }
    case USER_ADMIN: {
      return {
        ...state,
        isUserAdmin: true
      };
    }
    default:
      return state;
  }
};

export default appReducer;
