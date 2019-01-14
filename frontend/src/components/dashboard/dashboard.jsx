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
import walletIcon from "../../img/wallet.png";
import redeemIcon from "../../img/redeem.png";
import sponsorIcon from "../../img/sponsor.png";
import logoutIcon from "../../img/logout.png";
import hamburgerIcon from "../../img/hamburger.png";
import backArrowIcon from "../../img/backArrow.png";
import xIcon from "../../img/x.png";

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
    closing: false,
    userLoaded: false
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
        this.closeWithDelay = this.closeWithDelay.bind(this);
        this.removeURLParams = this.removeURLParams.bind(this);
        this.clearErrorMessage = this.clearErrorMessage.bind(this);
        this.expandMenu = this.expandMenu.bind(this);
        this.collapseMenu = this.collapseMenu.bind(this);
        this.userInfo = this.userInfo.bind(this);
        this.renderMenu = this.renderMenu.bind(this);
        this.returnToJobCents = this.returnToJobCents.bind(this);
    }

    componentWillMount() {
        axios.get("api/session")
            .then(function (verifyResp) {
                if (verifyResp.data.sessionVerified) {
                    console.log("earlier receive user in compqillmount in dashboard", verifyResp);
                    this.props.sessionLogin(verifyResp.data.user).then(user => {
                        this.setState({ userLoaded: true });
                        console.log("received user in dashboard", this.props.currentUser);
                    });
                }
            }.bind(this), function () {
                this.props.logout().then(() => {this.props.history.push("/")});
            }.bind(this));
        document.title = "jobCent - Dashboard";
        window.history.pushState({}, document.title, window.location.href);
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
        console.log("compDidMount dashboard.jsx, this.props.currentUser and .email", this.props.currentUser);
    }

    componentWillUnmount() {
        document.title = "jobCent";
    }

    loginRedirect() {
        this.props.logout().then(() => {
            this.props.history.push("/login");
        });
    }

    removeURLParams() {
        window.history.pushState({}, "", window.location.href.split("?")[0]);
    }

    clearErrorMessage() {
        this.setState({
            errorMessage: ""
        });
    }

    handleInput(key, options) {
        return e => {
            if (this.state.formType !== e.currentTarget.title) {
                setTimeout(this.collapseMenu, 130);
            }

            if (options && options.challengeUuid) {
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

    closeWithDelay() {
        this.setState({ closing: true});
        setTimeout(function() {
            this.setState({
                errorMessage: "",
                successMessage: "",
                formType: "jobCents",
                closing: false
            });
        }.bind(this), 350);
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
                errorMessage: "Please enter a valid email address."
            });
            return;
        }

        if (toAddress === this.props.currentUser.email) {
            this.setState({
                errorMessage: "Please enter the email address of another user."
            });
            return;
        }

        if (this.props.shareChallenge) {
            this.props.shareChallenge(challengeUuid, fromAddress, toAddress, numShares)
                .then(res => {
                    console.log("first .then in handleTransfer in dashboard.jsx", res);
                    if (res.errors && res.errors.response.data.message === "User not logged in") {
                        this.loginRedirect();
                        return;
                    }
                    console.log("about to fetchUser in handletransfer in dashboard", this.props.currentUser);
                    this.props.fetchUser(this.props.currentUser)
                        .then(res => {
                            console.log("second .then in handleTransfer in dashboard.jsx", res, this.props.userData);
                            let userData = this.props.userData;
                            if (userData) {
                                this.setState({
                                    sponsoredChallenges: userData.sponsoredChallenges,
                                    heldChallenges: userData.heldChallenges,
                                    successMessage: `You have successfully sent ${this.state.numShares} jobCent(s) to ${this.state.toAddress}.`,
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
                errorMessage: "Please click the checkbox to agree to the challenge bounty."
            });
            return;
        }

        if (isNaN(parseFloat(this.state.rewardAmount))) {
            this.setState({
                errorMessage: "Reward amount must be a number."
            });
            return;
        }

        if (Number(this.state.rewardAmount) <= 0) {
            this.setState({
                errorMessage: "Reward amount must be greater than 0."
            });
            return;
        }

        if (Number(this.state.maxShares) > 1000000) {
            this.setState({
                errorMessage: "Total jobCents can be 1,000,000 at maximum."
            });
            return;
        }

        if (Number(this.state.rewardAmount) > (2 ** 31 - 1)) {
            this.setState({
                errorMessage: "Reward amount is too high."
            });
            return;
        }

        if (Number(this.state.challengeDuration) > 3650) {
            this.setState({
                errorMessage: "Challenge duration is too long.  Maximum is 10 years."
            });
            return;
        }

        if (Number(this.state.challengeDuration) < 1) {
            this.setState({
                errorMessage: "Challenge duration is too short.  Minimum is 1 day."
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
                closeWithDelay={this.closeWithDelay}
                closing={this.state.closing}
                clearErrorMessage={this.clearErrorMessage}
                removeURLParams={this.removeURLParams}
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
                    closeWithDelay={this.closeWithDelay}
                    closing={this.state.closing}
                    clearErrorMessage={this.clearErrorMessage}
                    removeURLParams={this.removeURLParams}
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
                    closeWithDelay={this.closeWithDelay}
                    closing={this.state.closing}
                    clearErrorMessage={this.clearErrorMessage}
                    removeURLParams={this.removeURLParams}
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
                    closeWithDelay={this.closeWithDelay}
                    closing={this.state.closing}
                    clearErrorMessage={this.clearErrorMessage}
                    removeURLParams={this.removeURLParams}
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
                    closeWithDelay={this.closeWithDelay}
                    closing={this.state.closing}
                    clearErrorMessage={this.clearErrorMessage}
                    removeURLParams={this.removeURLParams}
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
                    closeWithDelay={this.closeWithDelay}
                    closing={this.state.closing}
                    clearErrorMessage={this.clearErrorMessage}
                    removeURLParams={this.removeURLParams}
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
                    closeWithDelay={this.closeWithDelay}
                    closing={this.state.closing}
                    clearErrorMessage={this.clearErrorMessage}
                    removeURLParams={this.removeURLParams}
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

    userInfo() {
        if (this.state.userLoaded) {
            return (
                <div className="userInfo">
                    {this.props.currentUser.email}
                </div>
            );
        } else {
            return (
                <div>
                    Loading...
                </div>
            );
        }
    }

    logOut() {
        this.props.logout().then(function() {this.props.history.push("/")}.bind(this));
    }

    renderMenu() {
        if (this.state.formType === "challengeDetail") {
            return (
                <div className="hamburgerContainer" onClick={this.returnToJobCents}>
                    <img className="backArrowIcon" src={backArrowIcon} />
                </div>
            )
        } else if (this.state.formType === "Send jobCents to another user" 
                || this.state.formType === "Redeem challenge") {
            return (
                <div className="hamburgerContainer" onClick={this.returnToJobCents}>
                    <img className="xIcon" src={xIcon} />
                </div>
            )
        } else {
            return (
                <div className="hamburgerContainer" onClick={this.expandMenu}>
                    <img className="hamburgerIcon" src={hamburgerIcon} />
                </div>
            )
        }
    }

    returnToJobCents() {
        this.setState({ formType: "jobCents" });
    }

    expandMenu() {
        console.log("expanding menu, menu element is", this.menu);
        this.menu.style.left = "0px";
    }

    collapseMenu() {
        console.log("collapsing menu, menu element is", this.menu);
        this.menu.style.left = "-185px";
    }

    render() {
        return (
            <div>
                <div className="jobCent-home">
                    {" "}
                    <div className="flex-container-home ">
                        <div className="layout-account-new flex-container-home ">
                            {/* <div className="hamburgerContainer" onClick={this.expandMenu}>
                                <img className="hamburgerIcon" src={hamburgerIcon} />
                            </div> */}
                            {this.renderMenu()}
                            <div className="menuClosed"
                            ref={(el) => this.menu = el}>
                                <div className="userInfoWrapper">
                                    {this.userInfo()}
                                </div>
                                <div className="menuItemsWrapper">
                                    <a
                                        title="jobCents"
                                        value="Wallet"
                                        id="ember1174"
                                        className={
                                            this.state.formType === "jobCents"
                                                ? "menuItemActive menuTextActive"
                                                : "menuItemInactive menuTextInactive"
                                        }
                                        onClick={this.handleInput("formType")}
                                    >
                                        <span className="menuIconTextContainer">
                                            <img src={walletIcon} className="menuIcon" />
                                            <span className="button-text menuTextAll">Wallet</span>
                                        </span>
                                    </a>
                                    <a
                                        title="Redeem referral code"
                                        value="referralCode"
                                        id="ember1174"
                                        className={
                                            this.state.formType === "Redeem referral code"
                                                ? "menuItemActive menuTextActive"
                                                : "menuItemInactive menuTextInactive"
                                        }
                                        onClick={this.handleInput("formType")}
                                    >
                                        <span className="menuIconTextContainer">
                                            <img src={redeemIcon} className="menuIcon" />
                                            <span className="button-text menuTextAll">Redeem Code</span>
                                        </span>
                                    </a>
                                    <a
                                        title="Sponsor a challenge"
                                        className={
                                            this.state.formType === "Sponsor a challenge"
                                                ? "menuItemActive menuTextActive"
                                                : "menuItemInactive menuTextInactive"
                                        }
                                        onClick={this.handleInput("formType")}
                                    >
                                        <span className="menuIconTextContainer">
                                            <img src={sponsorIcon} className="menuIcon" />
                                            <span className="button-text menuTextAll">Sponsor</span>
                                        </span>
                                    </a>
                                    <a
                                        title="Sign Out"
                                        className={
                                            this.state.formType === "Sign Out"
                                                ? "menuItemActive menuTextActive signOutMenuItem"
                                                : "menuItemInactive menuTextInactive signOutMenuItem"
                                        }
                                        onClick={this.handleInput("formType")}
                                    >
                                        <span className="menuIconTextContainer">
                                            <img src={logoutIcon} className="menuIcon" />
                                            <span className="button-text menuTextAll">Sign Out</span>
                                        </span>
                                    </a>
                                </div>
                            </div>
                            {/* <div className="account-navigation-bar flex-container-home">
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
                                <nav className="nav-items"> */}
                                    {/* <a
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
                                    </a> */}
                                {/* </nav>
                            </div> */}
                            <section className="yield-content" onClick={this.collapseMenu}>
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

export default Dashboard;
