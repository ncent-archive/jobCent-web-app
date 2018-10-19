import { connect } from "react-redux";
import Dashboard from "./dashboard";
import { logout } from "../../actions/session_actions";
import { fetchUser, shareChallenge, createChallenge, redeemChallenge} from "../../actions/dashboard_actions";

const mapStateToProps = (state, ownProps) => ({
  path: ownProps.test,
  loggedIn: Boolean(state.session.currentUser),
  errors: state.errors.session,
  currentUser: state.session.currentUser,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchUser: user => dispatch(fetchUser(user)),
  shareChallenge: (challengeUuid, fromAddress, toAddress) => dispatch(shareChallenge(challengeUuid, fromAddress, toAddress)),
  redeemChallenge: (challengeUuid, sponsorAddress) => dispatch(redeemChallenge(challengeUuid, sponsorAddress)),
  logout: () => dispatch(logout()),
  createChallenge: challenge => dispatch(createChallenge(challenge))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);
