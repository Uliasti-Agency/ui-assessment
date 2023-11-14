import {CURRENCY} from "../actionTypes";
import {Currency} from "../../../types/currency";


export interface setCurrentCurrencyResponse {
  type: string,
  payload: Currency
}

export function setCurrentCurrency(currency: Currency): setCurrentCurrencyResponse {
  return {
    type: CURRENCY,
    payload: currency
  }
}