import {
    RECEIVE_USER,
    RECEIVE_TRANSFER,
    RECEIVE_CHALLENGE,
    RECEIVE_LEAF_NODES
} from "../actions/dashboard_actions";
import {merge} from "lodash";

export default (state = {
    balance: {}, // changed balance into an object from array
    transfer: {},
    challenge: {},
    leafNodes: []
}, action) => {
    let newState;
    Object.freeze(state);
    switch (action.type) {
        case RECEIVE_USER:
            const userData = action.userData.data;
            console.log(userData);
            newState = merge({}, state);
            newState.userData = userData;
            return newState;
        case RECEIVE_TRANSFER:
            const transfer = action.transfer.data;
            newState = merge({}, state, {transfer});
            return newState;
        case RECEIVE_CHALLENGE:
            const challenge = action.challenge.data;
            newState = merge({}, state, {challenge});
            return newState;
        case RECEIVE_LEAF_NODES:
            const leafNodes = action.leafNodes.data;
            newState = merge({}, state, {leafNodes});
            return newState;
        default:
            return state;
    }
};
