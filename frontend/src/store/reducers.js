import { OPEN_MENU, CLOSE_MENU, USER_LOGIN, USER_LOGOUT } from "./actions";

const appReducer = (
  state = {
    isMenuOpen: false,
    isUserLogged: false
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
        isUserLogged: false
      };
    }
    default:
      return state;
  }
};

export default appReducer;
