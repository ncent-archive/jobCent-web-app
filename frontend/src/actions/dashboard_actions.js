import * as ApiUtil from "../util/session_api_util";

export const RECEIVE_USER = "RECEIVE_USER";
export const RECEIVE_TRANSFER = "RECEIVE_TRANSFER";
export const RECEIVE_CHALLENGE = "RECEIVE_CHALLENGE";
export const RECEIVE_CHALLENGES = "RECEIVE_CHALLENGES";
export const RECEIVE_DASH_ERRORS = "RECEIVE_DASH_ERRORS";
export const RECEIVE_CHALLENGE_BALANCES = "RECEIVE_CHALLENGE_BALANCES";
export const RECEIVE_CHALLENGE_USER_DATA = "RECEIVE_CHALLENGE_USER_DATA";
export const RESET_USER_DATA = "RESET_USER_DATA";

export const receiveUser = userData => ({
    type: RECEIVE_USER,
    userData
});

export const receiveErrors = errors => ({
    type: RECEIVE_DASH_ERRORS,
    errors
});

export const receiveTransfer = transfer => ({
    type: RECEIVE_TRANSFER,
    transfer
});

export const receiveChallenge = challenge => ({
    type: RECEIVE_CHALLENGE,
    challenge
});

export const receiveChallenges = challenges => ({
    type: RECEIVE_CHALLENGES,
    challenges
});

export const receiveChallengeBalances = challengeBalances => ({
    type: RECEIVE_CHALLENGE_BALANCES,
    challengeBalances
});

export const receiveChallengeUserData = challengeUserData => ({
    type: RECEIVE_CHALLENGE_USER_DATA,
    challengeUserData
});

export const resetUserData = () => ({
    type: RESET_USER_DATA
});


export const fetchUser = user => dispatch =>
    ApiUtil.fetchUser(user).then(
        balance => {
            console.log("fetchUser in dashboard_actions, payload is", balance);
           dispatch(receiveUser(balance))
        },
        err => dispatch(receiveErrors(err))
    );

export const shareChallenge = (challengeUuid, fromAddress, toAddress, numShares) => dispatch =>
    ApiUtil.shareChallenge(challengeUuid, fromAddress, toAddress, numShares).then(
        data => dispatch(receiveTransfer(data)),
        err => dispatch(receiveErrors(err))
    );

export const createChallenge = challenge => dispatch =>
    ApiUtil.createChallenge(challenge).then(
        data => dispatch(receiveChallenge(data)),
        err => {
            dispatch(receiveErrors(err));
        }
    );

export const redeemChallenge = (challengeUuid, sponsorAddress, redeemerAddress) => dispatch =>
    ApiUtil.redeemChallenge(challengeUuid, sponsorAddress, redeemerAddress).then(
        data => dispatch(receiveUser(data)),
        err => dispatch(receiveErrors(err))
    );

export const retrieveChallengeUsers = challengeUuid => dispatch =>
    ApiUtil.retrieveChallengeUsers(challengeUuid).then(
        data => dispatch(receiveChallengeBalances(data)),
        err => dispatch(receiveErrors(err))
    );

export const redeemReferralCode = (referralCode, recipientUuid) => dispatch =>
    ApiUtil.redeemReferralCode(referralCode, recipientUuid).then(
        data => dispatch(receiveTransfer(data)),
        err => dispatch(receiveErrors(err))
    );

export const getReferralCode = (userUuid, challengeUuid) => dispatch =>
    ApiUtil.getReferralCode(userUuid, challengeUuid).then(
        data => dispatch(receiveChallengeUserData(data)),
        err => dispatch(receiveErrors(err))
    );

export const setTokensPerReferral = (userUuid, challengeUuid, tokensPerReferral) => dispatch =>
    ApiUtil.setTokensPerReferral(userUuid, challengeUuid, tokensPerReferral).then(
        data => dispatch(receiveChallengeUserData(data)),
        err => dispatch(receiveErrors(err))
    );
