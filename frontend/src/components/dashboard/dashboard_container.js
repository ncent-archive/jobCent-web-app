import { connect } from "react-redux";
import Dashboard from "./dashboard";
import { logout } from "../../actions/session_actions";
import { fetchUser, sendChallenge, createChallenge} from "../../actions/dashboard_actions";

const mapStateToProps = (state, ownProps) => ({
  path: ownProps.test,
  loggedIn: Boolean(state.session.currentUser),
  errors: state.errors.session,
  currentUser: state.session.currentUser,
  tokenTypeUuid: state.dashboard.challenge && state.dashboard.challenge.tokenTypeUuid,
  createChallengeTransactionUuid: state.dashboard.challenge && state.dashboard.challenge.transactionUuid,
  latestTransactionUuid: state.dashboard.transaction && state.dashboard.transaction.transactionUuid,
  challengeTitle: state.dashboard.challenge && state.dashboard.challenge.challengeTitle,
  challengeDescription: state.dashboard.challenge && state.dashboard.challenge.challengeDescription,
  balance: state.dashboard.balance.balance,
  sponsoredChallenges: state.dashboard.balance.sponsoredChallenges
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchUser: (user, tokenTypeUuid) => dispatch(fetchUser(user, tokenTypeUuid)),
  sendChallenge: transaction => dispatch(sendChallenge(transaction)),
  logout: () => dispatch(logout()),
  createChallenge: challenge => dispatch(createChallenge(challenge))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);
