import {
  OPEN_MENU,
  CLOSE_MENU,
  USER_LOGIN,
  USER_LOGOUT,
  USER_ADMIN,
  USER_CLIENT
} from "./actions";

const appReducer = (
  state = {
    isMenuOpen: false,
    isUserLogged: false,
    isUserAdmin: false,
    clientCode: null
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
        isUserAdmin: false,
        clientCode: null
      };
    }
    case USER_ADMIN: {
      return {
        ...state,
        isUserAdmin: true
      };
    }
    case USER_CLIENT: {
      const { id } = action;
      return {
        ...state,
        clientCode: id
      };
    }
    default:
      return state;
  }
};

export default appReducer;
