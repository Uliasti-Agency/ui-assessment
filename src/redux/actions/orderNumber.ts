import {ORDER_NUMBER} from "../actionTypes";

export interface setCurrentOrderNumberResponse {
  type: string,
  payload: number | string
}

export function setCurrentOrderNumber(orderNumber: number | string): setCurrentOrderNumberResponse {
  return {
    type: ORDER_NUMBER,
    payload: orderNumber
  }
}