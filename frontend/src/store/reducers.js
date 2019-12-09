import { OPEN_MENU, CLOSE_MENU, USER_LOGIN, USER_LOGOUT } from "./actions";

const appReducer = (
  state = {
    isMenuOpen: false,
    isUserLogged: false,
    userToken: null
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
      const { token } = action;
      return {
        ...state,
        isUserLogged: true,
        userToken: token
      };
    }
    case USER_LOGOUT: {
      return {
        ...state,
        isUserLogged: false,
        userToken: null
      };
    }
    default:
      return state;
  }
};

export default appReducer;
