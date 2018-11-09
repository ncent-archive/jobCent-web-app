import {connect} from "react-redux";
import Dashboard from "./dashboard";
import {logout} from "../../actions/session_actions";
import {
    fetchUser,
    shareChallenge,
    createChallenge,
    redeemChallenge,
    retrieveLeafNodeUsers
} from "../../actions/dashboard_actions";

const mapStateToProps = (state, ownProps) => ({
    path: ownProps.test,
    loggedIn: Boolean(state.session.currentUser),
    errors: state.errors.session,
    currentUser: state.session.currentUser,
    userData: state.dashboard.userData,
    leafNodes: state.dashboard.leafNodes
});

const mapDispatchToProps = (dispatch) => ({
    fetchUser: user => dispatch(fetchUser(user)),
    shareChallenge: (challengeUuid, fromAddress, toAddress, numShares) => dispatch(shareChallenge(challengeUuid, fromAddress, toAddress, numShares)),
    redeemChallenge: (challengeUuid, sponsorAddress, redeemerAddress) => dispatch(redeemChallenge(challengeUuid, sponsorAddress, redeemerAddress)),
    logout: () => dispatch(logout()),
    createChallenge: challenge => dispatch(createChallenge(challenge)),
    retrieveLeafNodeUsers: challengeUuid => dispatch(retrieveLeafNodeUsers(challengeUuid))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Dashboard);
