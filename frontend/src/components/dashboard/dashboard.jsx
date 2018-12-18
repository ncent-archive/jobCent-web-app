import React from "react";
import { Route, Switch, Redirect, withRouter } from "react-router-dom";
import "../../scss/components/dashboard.css";
import MyJobCents from "./myJobCents";
import Transfer from "./transfer";
import ReferralCode from "./referralCode";
import Redeem from "./redeem";
import SponsorChallenge from "./sponsorChallenge.jsx";
import ChallengeDetail from "./challengeDetail.jsx";
import Wallet from "./wallet.jsx";
import Whitelist from "../../util/whitelist.js";
import axios from "axios";

function validateEmail(email) {
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(String(email).toLowerCase());
}

const defaultState = {
    formType: "jobCents",
    jobCents: "0",
    fromAddress: "",
    toAddress: "",
    redeemerAddress: "",
    challengeName: "",
    description: "",
    company: "",
    imageUrl: "",
    participationUrl: "",
    agreement: false,
    rewardAmount: 0,
    maxShares: 1000,
    challengeDuration: 90,
    numShares: 1,
    challengeBalance: 0,
    remainingRedemptions: 0,
    challengeUuid: "",
    sponsoredChallenges: [],
    challengesHeld: [],
    errorMessage: "",
    successMessage: "",
    challengeDetails: {},
    challengeUsers: [],
    referralCode: "",
    tokensPerReferral: 1,
    loginRedirect: false,
    spinner: true
};

class Dashboard extends React.Component {
    constructor(props) {
        super(props);

        this.state = defaultState;

        this.handleInput = this.handleInput.bind(this);
        this.update = this.update.bind(this);
        this.logOut = this.logOut.bind(this);
        this.jobCentsTab = this.jobCentsTab.bind(this);
        this.sponsorChallengeTab = this.sponsorChallengeTab.bind(this);
        this.transferTab = this.transferTab.bind(this);
        this.challengeDetailTab = this.challengeDetailTab.bind(this);
        this.handleTransfer = this.handleTransfer.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.createChallengeForUser = this.createChallengeForUser.bind(this);
        this.isWhitelisted = this.isWhitelisted.bind(this);
        // this.sponsorChallengeButton = this.sponsorChallengeButton.bind(this);
        this.goToChallengeDetail = this.goToChallengeDetail.bind(this);
        this.goToRedeemTab = this.goToRedeemTab.bind(this);
        this.redeemTab = this.redeemTab.bind(this);
        this.selectRedeemer = this.selectRedeemer.bind(this);
        this.handleRedeem = this.handleRedeem.bind(this);
        this.handleAgreementCheck = this.handleAgreementCheck.bind(this);
        this.referralCodeTab = this.referralCodeTab.bind(this);
        this.redeemReferralCode = this.redeemReferralCode.bind(this);
        this.walletTab = this.walletTab.bind(this);
        this.loginRedirect = this.loginRedirect.bind(this);
    }

    componentWillMount() {
        axios.get("api/session")
            .then(function (verifyResp) {
                // this.setState({spinner: false});
                if (verifyResp.data.sessionVerified) {
                    this.props.login(verifyResp.data.user)
                }
            }.bind(this), function () {
                console.log("compWillMount in dashboard.jsx, session not verified, logging out and pushing / to history");
                this.props.logout().then(() => {this.props.history.push("/")});
            }.bind(this))
            .then(() => {this.setState({spinner: false})});
    }

    componentDidMount() {
        const search = this.props.location.search; // get ?email=foo@bar.com
        const params = new URLSearchParams(search);
        const potentialformType = params.get('formType');
        let formType = "jobCents";
        let referralCode = "";
        if (potentialformType === "referral") {
            formType = "Redeem referral code";
            referralCode = params.get('referralCode');
            if (!referralCode) referralCode = '' // if its not there.
        }
        this.setState({
            formType: formType,
            referralCode: referralCode
        });
    }

    loginRedirect() {
        console.log("loginRedirect running in dashboard.jsx");
        this.props.logout().then(() => {
            console.log("in dasboard.jsx, .then on this.props.logout in loginRedirect()");
            this.props.history.push("/login");
        });
    }

    handleInput(key, options) {
        return e => {
            if (options && options.challengeUuid) {
                console.log("handleInput in dashboard.jsx, key, options, and e.currentTarget are", key, options, e.currentTarget);
                this.setState({
                    challengeUuid: options.challengeUuid,
                    challengeName: options.challengeName,
                    imageUrl: options.imageUrl,
                    errorMessage: "",
                    successMessage: "",
                    [key]: e.currentTarget.title
                });
            } else {
                this.setState({
                    errorMessage: "",
                    successMessage: "",
                    [key]: e.currentTarget.title
                });
            }
        };
    }

    update(key) {
        return e => {
            if (!e.currentTarget.value) {
                this.setState({
                    [key]: defaultState[key]
                });
            } else {
                this.setState({
                    [key]: e.currentTarget.value
                });
            }
        };
    }

    handleBlur() {
    }

    handleAgreementCheck() {
        if (this.state.agreement) {
            this.setState({agreement: false});
        } else {
            this.setState({agreement: true});
        }
    }

    isWhitelisted() {
        return Whitelist[this.props.currentUser.email];
    }

    goToChallengeDetail(challengeDetails, challengeBalance, remainingRedemptions) {
        this.setState({
            challengeDetails,
            challengeBalance,
            remainingRedemptions,
            formType: "challengeDetail"
        });
    }

    async goToRedeemTab(challengeDetails) {
        const challengeBalancesResponse = await this.props.retrieveChallengeUsers(challengeDetails.uuid);

        if (challengeBalancesResponse.errors && 
            challengeBalancesResponse.errors.response.data.message === "User not logged in") {
            // this.state.loginRedirect = true;
            this.loginRedirect();
            return;
        }

        if (challengeBalancesResponse.challengeBalances.data.challengeUsers.length) {
            this.setState({
                challengeUsers: challengeBalancesResponse.challengeBalances.data.challengeUsers,
                challengeDetails,
                formType: "Redeem challenge"
            });
        } else {
            this.setState({
                errorMessage: "No eligible redeemers at this time, click the 'Send' button to send jobCents to other users for redemption!"
            });
        }
    }

    async redeemReferralCode(e) {
        e.preventDefault();

        const referralCode = this.state.referralCode;
        const recipientUuid = this.props.currentUser.uuid;
        let redeemCodeStatus;

        this.props.redeemReferralCode(referralCode, recipientUuid)
            .then(res => {
                if (res.errors && res.errors.response.data.message === "User not logged in") {
                    this.loginRedirect();
                    return;
                }

                const numShares = res.transfer.data.sharedChallenge.transaction.numShares;
                if (res.type === "RECEIVE_DASH_ERRORS") {
                    this.setState({
                        formType: 'jobCents',
                        errorMessage: "Unable to redeem code. If you have already used this code, it cannot be redeemed again."
                    });
                } else {
                    this.props.fetchUser(this.props.currentUser)
                        .then(res => {
                            let userData = res.userData.data;
                            if (userData) {
                                this.setState({
                                    sponsoredChallenges: userData.sponsoredChallenges,
                                    heldChallenges: userData.heldChallenges,
                                    successMessage: `You have successfully redeemed ${numShares} jobCent(s)!`,
                                    formType: 'jobCents',
                                    maxShares: 1000,
                                    challengeDuration: 90,
                                    numShares: 1
                                });
                            }
                        })
                        .catch(err => {
                            console.log(err);
                        })
                }
            })
            .catch(err => {
                console.log(err);
            });
    }



    handleTransfer(e) {
        e.preventDefault();

        const challengeUuid = this.state.challengeUuid;
        const fromAddress = this.props.currentUser.email;
        const toAddress = this.state.toAddress;
        const numShares = this.state.numShares;

        if (!validateEmail(toAddress)) {
            this.setState({
                errorMessage: "Please enter a valid email address"
            });
            return;
        }

        if (toAddress === this.props.currentUser.email) {
            this.setState({
                errorMessage: "Please enter the email address of another user"
            });
            return;
        }

        if (this.props.shareChallenge) {
            this.props.shareChallenge(challengeUuid, fromAddress, toAddress, numShares)
                .then(res => {
                    console.log("handleTransfer in dashboard.jsx, res is", res);
                    if (res.errors && res.errors.response.data.message === "User not logged in") {
                        this.loginRedirect();
                        return;
                    }

                    this.props.fetchUser(this.props.currentUser)
                        .then(res => {
                            let userData = res.userData.data;
                            if (userData) {
                                this.setState({
                                    sponsoredChallenges: userData.sponsoredChallenges,
                                    heldChallenges: userData.heldChallenges,
                                    successMessage: `You have successfully sent ${this.state.numShares} jobCent(s) to ${this.state.toAddress}`,
                                    formType: 'jobCents',
                                    maxShares: 1000,
                                    challengeDuration: 90,
                                    numShares: 1
                                });
                            }
                        })
                        .catch(err => {
                            console.log(err);
                        })
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }

    createChallengeForUser(e) {
        e.preventDefault();
        if (!this.state.agreement) {
            this.setState({
                errorMessage: "Please click the checkbox to agree to the challenge bounty"
            });
            return;
        }
        if (isNaN(parseFloat(this.state.rewardAmount))) {
            this.setState({
                errorMessage: "Reward amount must be a number"
            });
            return;
        }
        const challenge = Object.assign({}, {
            senderPublicKey: this.props.currentUser.publicKey,
            senderPrivateKey: this.props.currentUser.privateKey,
            name: this.state.challengeTitle,
            description: this.state.description,
            company: this.state.company,
            imageUrl: this.state.imageUrl,
            participationUrl: this.state.participationUrl,
            rewardAmount: this.state.rewardAmount,
            maxShares: this.state.maxShares,
            challengeDuration: this.state.challengeDuration
        });
        this.props.createChallenge(challenge).then(res => {

            if (res.errors && res.errors.response.data.message === "User not logged in") {
                this.loginRedirect();
                return;
            }

            this.props.fetchUser(this.props.currentUser).then(balance => {
                this.setState(
                    {
                        ...this.state,
                        formType: 'jobCents',
                        agreement: false,
                        errorMessage: "",
                        successMessage: "",
                        maxShares: 1000,
                        challengeDuration: 90,
                        numShares: 1
                    });
            });
        });
    }

    selectRedeemer(redeemerAddress) {
        this.setState({
            redeemerAddress
        });
    }

    handleRedeem(challengeUuid, sponsorAddress) {
        this.props.redeemChallenge(challengeUuid, sponsorAddress, this.state.redeemerAddress).then(res => {

            if (res.message === "User not logged in") {
                this.loginRedirect();
                return;
            }

            this.props.fetchUser(this.props.currentUser).then(balance => {
                this.setState(
                    {
                        ...this.state,
                        formType: 'jobCents',
                        successMessage: "Your challenge has been redeemed! Please check your email for confirmation and details.",
                        maxShares: 1000,
                        challengeDuration: 90,
                        numShares: 1
                    }
                );
            });
        });
    }

    jobCentsTab() {
        if (this.state.formType === "jobCents" && this.props.currentUser) {
            return <MyJobCents
                currentUser={this.props.currentUser}
                fetchUser={this.props.fetchUser}
                handleInput={this.handleInput}
                userData={this.props.userData}
                goToChallengeDetail={this.goToChallengeDetail}
                goToRedeemTab={this.goToRedeemTab}
                successMessage={this.state.successMessage}
                errorMessage={this.state.errorMessage}
                loginRedirect={this.loginRedirect}
            />
        }
    }

    transferTab() {
        if (this.state.formType === "Send jobCents to another user") {
            return (
                <Transfer
                    handleInput={this.handleInput}
                    update={this.update}
                    handleTransfer={this.handleTransfer}
                    challengeName={this.state.challengeName}
                    challengeUuid={this.state.challengeUuid}
                    imageUrl={this.state.imageUrl}
                    errorMessage={this.state.errorMessage}
                    loginRedirect={this.loginRedirect}
                />
            );
        }
    }

    redeemTab() {
        if (this.state.formType === "Redeem challenge") {
            return (
                <Redeem
                    handleInput={this.handleInput}
                    selectRedeemer={this.selectRedeemer}
                    currentUser={this.props.currentUser}
                    handleRedeem={this.handleRedeem}
                    challengeDetails={this.state.challengeDetails}
                    challengeUsers={this.state.challengeUsers}
                    loginRedirect={this.loginRedirect}
                />
            )
        }
    }

    referralCodeTab() {
        if (this.state.formType === "Redeem referral code") {
            return (
                <ReferralCode
                    handleInput={this.handleInput}
                    update={this.update}
                    redeemReferralCode={this.redeemReferralCode}
                    referralCode={this.state.referralCode}
                    loginRedirect={this.loginRedirect}
                />
            )
        }
    }

    challengeDetailTab() {
        if (this.state.formType === "challengeDetail") {
            return (
                <ChallengeDetail
                    handleInput={this.handleInput}
                    challengeDetails={this.state.challengeDetails}
                    challengeBalance={this.state.challengeBalance}
                    remainingRedemptions={this.state.remainingRedemptions}
                    getReferralCode={this.props.getReferralCode}
                    currentUser={this.props.currentUser}
                    update={this.update}
                    setTokensPerReferral={this.props.setTokensPerReferral}
                    loginRedirect={this.loginRedirect}
                />
            )
        }
    }

    sponsorChallengeTab() {
        if (this.state.formType === "Sponsor a challenge") {
            return (
                <SponsorChallenge
                    handleInput={this.handleInput}
                    update={this.update}
                    createChallenge={this.createChallengeForUser}
                    errorMessage={this.state.errorMessage}
                    handleAgreementCheck={this.handleAgreementCheck}
                    loginRedirect={this.loginRedirect}
                />
            );
        }
    }

    walletTab() {
        if (this.state.formType === "Wallet") {
            return (
                <Wallet 
                    handleInput={this.handleInput}
                    loginRedirect={this.loginRedirect}
                />
            )
        }
    }

    // sponsorChallengeButton() {
    //     // if (this.isWhitelisted()) {
    //     return (
    //         <a
    //             title="Sponsor"
    //             className={
    //                 this.state.formType === "Sponsor"
    //                     ? "nav-item active"
    //                     : "nav-item"
    //             }
    //             onClick={this.handleInput("formType")}
    //         >
    //             <span className="button-text">Sponsor</span>
    //         </a>
    //     );
    //     // }
    // }

    signOutTab() {
        if (this.state.formType === "Sign Out") {
            return (
                <div
                    className={
                        this.state.formType === "Sign Out"
                            ? "modal-scroller show"
                            : "modal-scroller"
                    }
                >
                    <div className="modal-window">
                        <div className="modal-window-content">
                            <p className="instructions">Are you sure you want to sign out?</p>
                        </div>
                        <div className="modal-action-bar">
                            <a
                                title="jobCents"
                                onClick={this.handleInput("formType")}
                                className="action-button action-b-left"
                            >
                                No
                            </a>
                            <a onClick={this.logOut} className="action-button action-b-right">
                                Yes
                            </a>
                        </div>
                    </div>
                </div>
            );
        }
    }

    logOut() {
        this.props.logout().then(this.props.history.push("/"));
    }

    render() {
        if (this.state.spinner) {
            console.log("rendering spinner");
            return <div>Spinner.....</div>
        } else {
            console.log("No longer rendering spinner");
            return (
                <div>
                    <div className="jobCent-home">
                        {" "}
                        <div className="flex-container-home ">
                            <div className="layout-account-new flex-container-home ">
                                <div className="account-navigation-bar flex-container-home">
                                    <div className="customer-info">
                                        <div className="customer-profile-simple">
                                            <i
                                                style={{backgroundColor: "#FB60C4"}}
                                                className="customer-avatar"
                                            >
                                                {" "}
                                                <div className="initial-placeholder">D</div>
                                            </i>
                                            <h3 id="ember1124" className="display-name">
                                                <span className="name">Alpha Tester</span>
                                            </h3>
                                            <h4 className="jobTag">
                                                <a className="ember-view">$userId</a>
                                            </h4>
                                        </div>
                                    </div>
                                    <nav className="nav-items">
                                        <a
                                            title="Wallet"
                                            value="Wallet"
                                            id="ember1174"
                                            className={
                                                this.state.formType === "Wallet"
                                                    ? "nav-item active"
                                                    : "nav-item"
                                            }
                                            onClick={this.handleInput("formType")}
                                        >
                                            <span className="button-text">Wallet</span>
                                        </a>
                                        <a
                                            title="Redeem referral code"
                                            value="referralCode"
                                            id="ember1174"
                                            className={
                                                this.state.formType === "Redeem referral code"
                                                    ? "nav-item active"
                                                    : "nav-item"
                                            }
                                            onClick={this.handleInput("formType")}
                                        >
                                            <span className="button-text">Redeem Code</span>
                                        </a>
                                        <a
                                            title="Sponsor a challenge"
                                            className={
                                                this.state.formType === "Sponsor a challenge"
                                                    ? "nav-item active"
                                                    : "nav-item"
                                            }
                                            onClick={this.handleInput("formType")}
                                        >
                                            <span className="button-text">Sponsor</span>
                                        </a>
                                        <a
                                            title="Sign Out"
                                            className={
                                                this.state.formType === "Sign Out"
                                                    ? "nav-item signout active"
                                                    : "nav-item"
                                            }
                                            onClick={this.handleInput("formType")}
                                        >
                                            <span className="button-text">Sign Out</span>
                                        </a>
                                        <a
                                            title="Testing logoutFunc"
                                            className={
                                                this.state.formType === "testing"
                                                    ? "nav-item signout active"
                                                    : "nav-item"
                                            }
                                            onClick={this.loginRedirect}
                                        >
                                            <span className="button-text">Test logoutFunc</span>
                                        </a>
                                    </nav>
                                </div>
                                <section className="yield-content">
                                    {this.jobCentsTab()}
                                    {this.signOutTab(this.props.logout)}
                                    {this.transferTab()}
                                    {this.sponsorChallengeTab()}
                                    {this.challengeDetailTab()}
                                    {this.redeemTab()}
                                    {this.referralCodeTab()}
                                    {this.walletTab()}
                                </section>
                            </div>
                        </div>
                        <div className="modal-manager ">
                            <div className="modal-overlay "/>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default Dashboard;
