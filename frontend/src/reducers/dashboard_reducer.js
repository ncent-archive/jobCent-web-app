import {
    RECEIVE_USER,
    RECEIVE_TRANSFER,
    RECEIVE_CHALLENGE,
    RECEIVE_CHALLENGE_BALANCES,
    RECEIVE_REFERRAL_CODE
} from "../actions/dashboard_actions";
import {merge} from "lodash";

export default (state = {
    balance: {}, // changed balance into an object from array
    transfer: {},
    challenge: {},
    challengeBalances: [],
    referralCode: ""
}, action) => {
    let newState;
    Object.freeze(state);
    switch (action.type) {
        case RECEIVE_USER:
            const userData = action.userData.data;
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
        case RECEIVE_CHALLENGE_BALANCES:
            const challengeBalances = action.challengeBalances.data;
            newState = merge({}, state, {challengeBalances});
            return newState;
        case RECEIVE_REFERRAL_CODE:
            const referralCode = action.referralCode.data;
            newState = merge({}, state, {referralCode});
            return newState;
        default:
            return state;
    }
};
