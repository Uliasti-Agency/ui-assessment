import {ORDER_NUMBER} from '../actionTypes';
import {setCurrentOrderNumberResponse} from "../actions/orderNumber";

const initialState = {
  orderNumber: 0
}

export default (state = initialState, action: setCurrentOrderNumberResponse) => {
  switch (action.type) {
    case ORDER_NUMBER:
      return {
        orderNumber: action.payload
      }
    default:
      return state;
  }
}