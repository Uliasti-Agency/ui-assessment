import {ADD_AUTH_DATA} from "../actionTypes";
import {Token} from "../../../types/token";

export interface setCurrentAuthDataResponse {
  type: string,
  payload: Token,
}


export function setCurrentAuthData({
                                     userInfo,
                                     idToken,
                                     accessToken,
                                     authenticated,
                                     isLoginPending
                                   }: Token): setCurrentAuthDataResponse {
  return {
    type: ADD_AUTH_DATA,
    payload: {userInfo, idToken, accessToken, authenticated, isLoginPending}
  }
}