import React, {Component} from "react";
import Landing from "./components/landing";
import {AuthRoute, ProtectedRoute} from "./util/route_util";
import {Route, Switch, Redirect} from "react-router-dom";
import "./scss/App.css";
import SessionFormContainer from "./components/session/session_form_container";
import DashboardContainer from "./components/dashboard/dashboard_container";

class App extends Component {
    render() {
        return <div className="App">
            <Switch>
                <Route path="/dashboard" component={DashboardContainer}/>
                <AuthRoute path="/login" component={SessionFormContainer}/>
                <Route exact path="/" component={Landing}/>
                <Redirect to="/"/>
            </Switch>
        </div>;
    }
}

export default App;
