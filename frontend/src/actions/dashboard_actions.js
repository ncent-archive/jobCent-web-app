import * as ApiUtil from "../util/session_api_util";
export const RECEIVE_USER = "RECEIVE_USER";
export const RECEIVE_TRANSFER = "RECEIVE_TRANSFER";
export const RECEIVE_CHALLENGE = "RECEIVE_CHALLENGE";
export const RECEIVE_CHALLENGES = "RECEIVE_CHALLENGES";
export const RECEIVE_DASH_ERRORS = "RECEIVE_DASH_ERRORS";

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

export const fetchUser = user => dispatch =>
  ApiUtil.fetchUser(user).then(
    balance => dispatch(receiveUser(balance)),
    err => dispatch(receiveErrors(err))
  );

export const shareChallenge = (challengeUuid, fromAddress, toAddress) => dispatch =>
  ApiUtil.shareChallenge(challengeUuid, fromAddress, toAddress).then(
    data => dispatch(receiveTransfer(data)),
    err => dispatch(receiveErrors(err))
  );

export const createChallenge = challenge => dispatch =>
    ApiUtil.createChallenge(challenge).then(
        data => dispatch(receiveChallenge(data)),
        err => {
            console.log(err);
            dispatch(receiveErrors(err));
        }
    );

export const redeemChallenge = (challengeUuid, sponsorAddress) => dispatch =>
    ApiUtil.redeemChallenge(challengeUuid, sponsorAddress).then(
      data => dispatch(receiveUser(data)),
      err => dispatch(receiveErrors(err))
    );
