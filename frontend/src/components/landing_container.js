import { connect } from "react-redux";
import Dashboard from "./landing.jsx";
import { sessionLogin } from "../actions/session_actions.js";


const mapStateToProps = (state, ownProps) => ({

});

const mapDispatchToProps = (dispatch) => ({
  sessionLogin: user => dispatch(sessionLogin(user)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);
