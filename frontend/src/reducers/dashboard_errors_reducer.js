import {
    RECEIVE_DASH_ERRORS
} from "../actions/dashboard_actions";
import { merge } from "lodash";

export default (state = {}, action) => {
    let newState;

    Object.freeze(state);
    switch (action.type) {
        case RECEIVE_DASH_ERRORS:
            newState = merge({}, state, action.errors.response.data);
            return newState;
        default:
            return state;
    }
};