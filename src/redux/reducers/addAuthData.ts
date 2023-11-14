import {ADD_AUTH_DATA} from "../actionTypes";
import {setCurrentAuthDataResponse} from "../actions/authData";
import {Token} from "../../../types/token";

const initialState: Token = {
  userInfo: null,
  idToken: null,
  accessToken: null,
  authenticated: false,
  isLoginPending: false,
}

export default (state: Token = initialState, action: setCurrentAuthDataResponse): Token => {
  switch (action.type) {
    case ADD_AUTH_DATA:
      return {
        userInfo: action.payload.userInfo,
        idToken: action.payload.idToken,
        accessToken: action.payload.accessToken,
        authenticated: action.payload.authenticated,
        isLoginPending: action.payload.isLoginPending
      }
    default:
      return state;
  }
}