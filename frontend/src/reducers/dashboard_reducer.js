import {
  RECEIVE_BALANCE,
  RECEIVE_TRANSFER_HISTORY,
  RECEIVE_TRANSFER,
  RECEIVE_CHALLENGE
} from "../actions/dashboard_actions";
import { merge } from "lodash";

export default (state = {
                    balance: [],
                    history: [],
                    transfer: {},
                    challenge: {}
                }, action) => {
  let newState;
  Object.freeze(state);
  switch (action.type) {
    case RECEIVE_BALANCE:
        const balance = action.balance.data;
        newState = merge({}, state, { balance });
        return newState;
    case RECEIVE_TRANSFER_HISTORY:
        const history = action.history.data;
        newState = merge({}, state, { history });
        return newState;
    case RECEIVE_TRANSFER:
        const transfer = action.transfer.data;
        newState = merge({}, state, { transfer });
        return newState;
    case RECEIVE_CHALLENGE:
        const challenge = action.challenge.data;
        newState = merge({}, state, { challenge });
        return newState;
    default:
      return state;
  }
};
