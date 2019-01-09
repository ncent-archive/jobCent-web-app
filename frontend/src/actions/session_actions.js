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
      dispatch(receiveCurrentUser(userP.data));
      return userP;
    },
    err => {
      dispatch(receiveErrors(err.response.data));
      return err.response.data;
    }
  );

export const sendMail = email => dispatch =>
  ApiUtil.sendMail(email).then((res) => {
      return res;
    }
  )

export const sessionLogin = user => async (dispatch) => {
  let userP;
  try {
    userP = await ApiUtil.sessionLogin(user);
    dispatch(receiveCurrentUser(userP.data.user));
  } catch (err) {
    dispatch(receiveErrors(err.response.data));
  }
  // ApiUtil.sessionLogin(user).then(
  //   user => {
  //     dispatch(receiveCurrentUser(user.data.user));
  //   },
  //   err => {
  //     dispatch(receiveErrors(err.response.data));
  //   }
  // )
}


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
      return userP;
    },
    err => {
      dispatch(receiveErrors(err.response.data));
      return err.response.data;
    }
  );
