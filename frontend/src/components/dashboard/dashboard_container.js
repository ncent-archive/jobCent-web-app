import { connect } from "react-redux";
import Dashboard from "./dashboard";
import { logout } from "../../actions/session_actions";
import { fetchBalance, fetchHistory, sendJobCents, saveName, createChallenge} from "../../actions/dashboard_actions";

const mapStateToProps = (state, ownProps) => ({
  path: ownProps.test,
  loggedIn: Boolean(state.session.currentUser),
  errors: state.errors.session,
  currentUser: state.session.currentUser
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchBalance: user => dispatch(fetchBalance(user)),
  fetchHistory: user => dispatch(fetchHistory(user)),
  saveName: user => dispatch(saveName(user)),
  sendJobCents: user => dispatch(sendJobCents(user)),
  logout: () => dispatch(logout()),
  createChallenge: challenge => dispatch(createChallenge(challenge))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);
