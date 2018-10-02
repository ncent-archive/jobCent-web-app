import { combineReducers } from "redux";
import errorsReducer from "./errors_reducer";
import sessionReducer from "./session_reducer";
import dashboardReducer from "./dashboard_reducer";

export default combineReducers({
  session: sessionReducer,
  dashboard: dashboardReducer,
  errors: errorsReducer
});
