import * as ApiUtil from "../util/session_api_util";
export const RECEIVE_BALANCE = "RECEIVE_BALANCE";
export const RECEIVE_BALANCES = "RECEIVE_BALANCES";
export const RECEIVE_TRANSFER = "RECEIVE_TRANSFER";
export const RECEIVE_TRANSFER_HISTORY = "RECEIVE_TRANSFER_HISTORY";
export const RECEIVE_CHALLENGE = "RECEIVE_CHALLENGE";
export const RECEIVE_CHALLENGES = "RECEIVE_CHALLENGES";
export const RECEIVE_DASH_ERRORS = "RECEIVE_DASH_ERRORS";

export const receiveBalance = balance => ({
  type: RECEIVE_BALANCE,
  balance
});

export const receiveBalances = balances => ({
    type: RECEIVE_BALANCES,
    balances
});

export const receiveErrors = errors => ({
  type: RECEIVE_DASH_ERRORS,
  errors
});

export const receiveTransfer = transfer => ({
  type: RECEIVE_TRANSFER,
  transfer
});

export const receiveTransferHistory = history => ({
  type: RECEIVE_TRANSFER_HISTORY,
  history
});

export const receiveChallenge = challenge => ({
    type: RECEIVE_CHALLENGE,
    challenge
});

export const receiveChallenges = challenges => ({
    type: RECEIVE_CHALLENGES,
    challenges
});

export const fetchBalance = (user, tokenTypeUuid) => dispatch =>
  ApiUtil.fetchBalance(user, tokenTypeUuid).then(
    balance => dispatch(receiveBalance(balance)),
    err => {
      console.log(err);
      dispatch(receiveErrors(err));
    }
  );

export const sendJobCents = transaction => dispatch =>
  ApiUtil.sendJobCents(transaction).then(
    data => dispatch(receiveTransfer(data)),
    err => {
      console.log(err);
      dispatch(receiveErrors(err));
    }
  );

export const saveName = user => dispatch =>
  ApiUtil.saveName(user).then(
    data => console.log(data),
    err => {
      console.log(err);
      dispatch(receiveErrors(err));
    }
  );

export const fetchTransferHistory = user => dispatch =>
  ApiUtil.fetchTransferHistory(user).then(
    data => dispatch(receiveTransferHistory(data)),
    err => {
      console.log(err);
      dispatch(receiveErrors(err));
    }
  );

export const createChallenge = challenge => dispatch =>
    ApiUtil.createChallenge(challenge).then(
        data => dispatch(receiveChallenge(data)),
        err => {
            console.log(err);
            dispatch(receiveErrors(err));
        }
    );
