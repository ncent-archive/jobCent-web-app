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
      console.log(userP.data.user);

      dispatch(receiveCurrentUser(userP.data.user));
    },
    err => {
      dispatch(receiveErrors(err.response.data));
    }
  );

export const logout = () => dispatch =>
  ApiUtil.logout().then(() => dispatch(receiveCurrentUser(null)));

export const signup = user => dispatch =>
  ApiUtil.signup(user).then(
    userP => userP,
    err => dispatch(receiveErrors(err.response.data))
  );
