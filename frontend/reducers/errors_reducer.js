import { combineReducers } from 'redux';
import sessionErrorsReducer from './session_errors_reducer';
import dashboardErrorsReducer from './dashboard_errors_reducer';

export default combineReducers({
    session: sessionErrorsReducer,
    dashboard: dashboardErrorsReducer
});
