import {CART_ITEM_NUMBER} from '../actionTypes';
import {setCurrentCartItemNumberResponse} from "../actions/cartItemNumber";

const initialState = {
  cartItemNumber: 0
}

export default (state = initialState, action: setCurrentCartItemNumberResponse) => {
  switch (action.type) {
    case CART_ITEM_NUMBER:
      return {
        cartItemNumber: action.payload
      }
    default:
      return state;
  }
}