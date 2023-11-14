import {CART_ITEM_NUMBER} from "../actionTypes";

export interface setCurrentCartItemNumberResponse {
  type: string,
  payload: number | string
}

export function setCurrentCartItemNumber(cartItemNumber: number | string): setCurrentCartItemNumberResponse {
  return {
    type: CART_ITEM_NUMBER,
    payload: cartItemNumber
  }
}