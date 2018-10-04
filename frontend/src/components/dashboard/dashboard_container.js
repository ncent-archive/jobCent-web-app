import { connect } from "react-redux";
import Dashboard from "./dashboard";
import { logout } from "../../actions/session_actions";
import { fetchBalance, fetchTransferHistory, sendJobCents, saveName, createChallenge} from "../../actions/dashboard_actions";

const mapStateToProps = (state, ownProps) => ({
  path: ownProps.test,
  loggedIn: Boolean(state.session.currentUser),
  errors: state.errors.session,
  currentUser: state.session.currentUser,
  tokenTypeUuid: state.dashboard.challenge && state.dashboard.challenge.tokenTypeUuid,
  createChallengeTransactionUuid: state.dashboard.challenge && state.dashboard.challenge.transactionUuid,
  latestTransactionUuid: state.dashboard.transaction && state.dashboard.transaction.transactionUuid,
  challengeTitle: state.dashboard.challenge && state.dashboard.challenge.challengeTitle,
  challengeDescription: state.dashboard.challenge && state.dashboard.challenge.challengeDescription
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchBalance: (user, tokenTypeUuid) => dispatch(fetchBalance(user, tokenTypeUuid)),
  fetchTransferHistory: user => dispatch(fetchTransferHistory(user)),
  saveName: user => dispatch(saveName(user)),
  sendJobCents: transaction => dispatch(sendJobCents(transaction)),
  logout: () => dispatch(logout()),
  createChallenge: challenge => dispatch(createChallenge(challenge))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);
