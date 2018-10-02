import { RECEIVE_SESSION_ERRORS, RECEIVE_CURRENT_USER, CLEAR_ERRORS } from '../actions/session_actions';

export default (state = [], action) => {
    Object.freeze(state);
    switch (action.type) {
        case RECEIVE_CURRENT_USER:
            return state;
        case CLEAR_ERRORS:
            return state;
        case RECEIVE_SESSION_ERRORS:
            return action.errors;
        default:
            return state;
    }
};
