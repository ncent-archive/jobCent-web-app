import React from "react";
import ncentLogo from "../../img/logo.png";
import _ from 'lodash';

export default class MyJobCents extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            sponsoredChallenges: [],
            sponsoredChallengeBalances: [],
            sponsoredChallengeRemainingRedemptions: [],
            heldChallenges: [],
            heldChallengeBalances: [],
            heldChallengeRemainingRedemptions: [],
            successMessage: "",
            errorMessage: ""
        };

        this.challengeList = this.challengeList.bind(this);
        this.successMessage = this.successMessage.bind(this);
        this.errorMessage = this.errorMessage.bind(this);
    }

    componentWillMount() {
        this.props.fetchUser(this.props.currentUser)
            .then(res => {
                if (this.props.userData) {
                    this.setState({
                        sponsoredChallenges: this.props.userData.sponsoredChallenges,
                        sponsoredChallengeBalances: this.props.userData.sponsoredChallengeBalances,
                        sponsoredChallengeRemainingRedemptions: this.props.userData.sponsoredChallengeRemainingRedemptions,
                        heldChallenges: this.props.userData.heldChallenges,
                        heldChallengeBalances: this.props.userData.heldChallengeBalances,
                        heldChallengeRemainingRedemptions: this.props.userData.heldChallengeRemainingRedemptions
                    });
                }
            })
    }

    componentDidUpdate(prevProps) {
        if (this.props.userData && !_.isEqual(this.props.userData, prevProps.userData)) {
            this.setState({
                sponsoredChallenges: this.props.userData.sponsoredChallenges,
                heldChallenges: this.props.userData.heldChallenges
            });
        }
    }

    successMessage(message) {
        if (message) {
            return <div className="successMessage"><span>{message}</span></div>;
        }
    }

    errorMessage(message) {
        if (message) {
            return <div className="errorMessage"><span>{message}</span></div>;
        }
    }

    challengeList(sponsoredChallenges, heldChallenges, sponsoredChallengeBalances, heldChallengeBalances, sponsoredChallengeRemainingRedemptions, heldChallengeRemainingRedemptions) {
        const sponsoredChallengeTiles = sponsoredChallenges.map(function (sponsoredChallenge, index) {
            return (<div key={index} className="balanceTile">
                <h2 className="balance-title">{sponsoredChallenge.company}</h2>
                <img className="logoImg" src={sponsoredChallenge.imageUrl || ncentLogo} alt="ncent logo"
                     onClick={() => {
                         this.props.goToChallengeDetail(sponsoredChallenge, sponsoredChallengeBalances[index], sponsoredChallengeRemainingRedemptions[index])
                     }}/>
                <h2 className="balance-title">{sponsoredChallenge.name}</h2>
                <h3 className="balance-subtitle">Sponsored</h3>
                <h3 className="balance-subtitle">{sponsoredChallengeBalances[index]} jobCent(s)</h3>
                <a
                    title="New"
                    className="initiate-payment-smaller-margin"
                    onClick={this.props.handleInput("formType", {
                        challengeName: sponsoredChallenge.name,
                        challengeUuid: sponsoredChallenge.uuid,
                        imageUrl: sponsoredChallenge.imageUrl
                    })}
                >
                    Send
                </a>
                <a
                    title="Redeem"
                    className="initiate-payment"
                    onClick={() => {
                        this.props.goToRedeemTab(sponsoredChallenge)
                    }}
                >
                    Redeem
                </a>
            </div>);
        }.bind(this));
        const heldChallengeTiles = heldChallenges.map(function (heldChallenge, index) {
            return (<div key={index} className="balanceTile">
                <h2 className="balance-title">{heldChallenge.company}</h2>
                <img className="logoImg" src={heldChallenge.imageUrl || ncentLogo} alt="ncent logo" onClick={() => {
                    this.props.goToChallengeDetail(heldChallenge, heldChallengeBalances[index], heldChallengeRemainingRedemptions[index])
                }}/>
                <h2 className="balance-title">{heldChallenge.name}</h2>
                <h3 className="balance-subtitle">{heldChallengeBalances[index]} jobCent(s)</h3>
                <a
                    title="New"
                    className="initiate-payment-smaller-margin"
                    onClick={this.props.handleInput("formType", {
                        challengeName: heldChallenge.name,
                        challengeUuid: heldChallenge.uuid,
                        imageUrl: heldChallenge.imageUrl
                    })}
                >
                    Send
                </a>
                <a
                    className="initiate-payment"
                    href={heldChallenge.participationUrl}
                >
                    Apply
                </a>
            </div>);
        }.bind(this));
        return (
            <div className="challengesPage">
                {this.successMessage(this.props.successMessage)}
                {this.errorMessage(this.props.errorMessage)}
                <h1 className="challengesHeader">Your jobCent Challenges</h1>
                <section className="challengeTiles">{sponsoredChallengeTiles}</section>
                <section className="challengeTiles">{heldChallengeTiles}</section>
            </div>
        );
    }

    render() {
        return (
            this.challengeList(this.state.sponsoredChallenges, this.state.heldChallenges, this.state.sponsoredChallengeBalances, this.state.heldChallengeBalances, this.state.sponsoredChallengeRemainingRedemptions, this.state.heldChallengeRemainingRedemptions)
        );
    }
}

