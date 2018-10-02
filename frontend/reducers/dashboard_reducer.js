import {
  RECEIVE_BALANCE,
  RECEIVE_HISTORY,
  RECEIVE_TRANSFER
} from "../actions/dashboard_actions";
import { merge } from "lodash";

export default (state = {}, action) => {
  let newState;

  Object.freeze(state);
  switch (action.type) {
    case RECEIVE_BALANCE:
      newState = merge({}, state, action.balance);
      return newState;
    case RECEIVE_HISTORY:
          newState = merge({}, state, action.history.data);
      return newState;
    case RECEIVE_TRANSFER:
          newState = merge({}, state, action.data);
      return newState;
    default:
      return state;
  }
};
