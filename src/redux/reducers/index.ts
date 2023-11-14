import {combineReducers} from 'redux';
import addAuthData from "./addAuthData";
import getCartItemNumber from "./getCartItemNumber";
import getOrderNumber from "./getOrderNumber";
import currency from "./currency";
import language from "./language";

export default combineReducers({
  addAuthData,
  getCartItemNumber,
  getOrderNumber,
  currency,
  language
});