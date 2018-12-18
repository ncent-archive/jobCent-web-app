import { merge } from 'lodash';
import { RECEIVE_CURRENT_USER, } from '../actions/session_actions';

export default (state = { currentUser: null }, action) => {
    Object.freeze(state);
    switch (action.type) {
        case RECEIVE_CURRENT_USER:
            console.log("in session_reducer, case RECEIVE_CURRENT_USER", action);
            const currentUser = action.currentUser;
            return merge({}, { currentUser });
        default:
            return state;
    }
};
