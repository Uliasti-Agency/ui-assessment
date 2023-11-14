import {CURRENCY} from "../actionTypes";
import {setCurrentCurrencyResponse} from "../actions/currency";

export default (state = null, action: setCurrentCurrencyResponse) => {
  switch (action.type) {
    case CURRENCY:
      return action.payload;
    default:
      return state;
  }
}
