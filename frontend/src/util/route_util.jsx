import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect, withRouter } from 'react-router-dom';


const Auth = ({component: Component, path, loggedIn}) => (
  <Route path={path} render={(props) => (
      !loggedIn ? (
        <Component {...props} />
      ) : (
        <Redirect to="/dashboard" />
        // {/* <Redirect to="/placeholderURL1" /> */}
      )
    )} />
);

const Protected = ({component: Component, path, loggedIn}) => (
  <Route path={path} render={(props) => {

      if (loggedIn) {
        return <Component {...props} />;

      } else {
     
        return <Redirect to="/signup" />;
      }
    }} />
);

const mapStateToProps = state => {
  
  return ({
    loggedIn: Boolean(state.session.currentUser),
  
  });
};

export const AuthRoute = withRouter(connect(mapStateToProps, null)(Auth));
export const ProtectedRoute = withRouter(connect(mapStateToProps, null)(Protected));
