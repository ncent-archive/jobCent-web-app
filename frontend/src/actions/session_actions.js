import * as ApiUtil from "../util/session_api_util";
export const RECEIVE_CURRENT_USER = "RECEIVE_CURRENT_USER";
export const RECEIVE_SESSION_ERRORS = "RECEIVE_SESSION_ERRORS";
export const CLEAR_ERRORS = "CLEAR_ERRORS";

export const receiveCurrentUser = currentUser => ({
  type: RECEIVE_CURRENT_USER,
  currentUser
});

export const clearErrors = () => ({
  type: CLEAR_ERRORS
});

export const receiveErrors = errors => ({
  type: RECEIVE_SESSION_ERRORS,
  errors
});

export const login = user => dispatch =>
  ApiUtil.login(user).then(
    userP => {
      console.log("in login in session_actions, user about to be dispatched is", userP.data);
      dispatch(receiveCurrentUser(userP.data));
      return userP;
    },
    err => {
      console.log("in login in session_actions, err", err, "err.response.data", err.response.data);
      dispatch(receiveErrors(err.response.data));
      return err.response.data;
    }
  );

export const sendMail = email => dispatch =>
  ApiUtil.sendMail(email).then((res) => {
      console.log("in sendMail in session_actions.js, just sent mail to", email);
      return res;
    }
  )

export const sessionLogin = user => dispatch =>
  ApiUtil.sessionLogin(user).then(
    user => {
      console.log("in sessionLogin in session_actions.js, user about to be dispatched", user);
      dispatch(receiveCurrentUser(user.data.user));
    },
    err => {
      console.log("in sessionLogin in session_actions, err", err);
      dispatch(receiveErrors(err.response.data));
    }
  )

export const logout = () => dispatch =>
  ApiUtil.logout().then(
    () => {
      dispatch(receiveCurrentUser(null));
    }
  ).catch(error => {
    dispatch(receiveCurrentUser(null));
  });

export const signup = user => dispatch =>
  ApiUtil.signup(user).then(
    userP => {
      console.log("in singup on session_actions, user returned is", userP);
      return userP;
    },
    err => {
      console.log("in singup on session_actions, error", err);
      dispatch(receiveErrors(err.response.data));
      return err.response.data;
    }
  );
