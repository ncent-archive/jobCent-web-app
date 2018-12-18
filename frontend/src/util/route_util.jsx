import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect, withRouter } from 'react-router-dom';


const Auth = ({component: Component, path, loggedIn}) => {
  console.log("Auth in route_util.jsx, url is", window.location.href);
  let dashboardLink = "/dashboard";
  let strIdx = window.location.href.indexOf("?");
  let str = "";
  if (strIdx >= 0) {
    // str = window.location.href.slice(strIdx)
    dashboardLink += window.location.href.slice(strIdx);
  }
  return (
    <Route path={path} render={(props) => (
        !loggedIn ? (
          <Component {...props} />
        ) : (
          <Redirect to={dashboardLink} />
        )
      )} />
  )
};

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
