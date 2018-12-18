import React, {Component} from "react";
import Landing from "./components/landing";
import {AuthRoute, ProtectedRoute} from "./util/route_util";
import {Route, Switch, Redirect, withRouter} from "react-router-dom";
import ReactGA from 'react-ga';
import "./scss/App.css";
import SessionFormContainer from "./components/session/session_form_container";
import DashboardContainer from "./components/dashboard/dashboard_container";

function initializeReactGA(vals) {
	ReactGA.initialize('UA-130208537-1');
	console.log(vals);
	ReactGA.pageview(vals);
}


class App extends Component {


  componentDidMount() {
      initializeReactGA(this.props.location.pathname+this.props.location.search)
      this.props.history.listen((location, action) => {
	      console.log('History changed!', location.pathname,location.search, action);
	      ReactGA.pageview(location.pathname + location.search);
	  });
    }
    
    render() {
        return <div className="App">
            <Switch>
                <Route path="/dashboard" component={DashboardContainer}/>
                <AuthRoute path="/login" component={SessionFormContainer}/>
                <Route exact path="/" component={Landing}/>
                <Redirect to="/"/>
                {/* <Redirect to="/placeholderURL2" /> */}
            </Switch>
        </div>;
    }
}

export default withRouter(App);
