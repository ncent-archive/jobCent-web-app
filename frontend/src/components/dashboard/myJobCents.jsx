import React from "react";
import ncentLogo from "../../img/logo.png";

export default class MyJobCents extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            sponsoredChallenges: [],
            heldChallenges: []
        };

        this.challengeList = this.challengeList.bind(this);
    }
    componentWillMount() {
        this.props.fetchUser(this.props.currentUser)
            .then(res => {
                let userData = res.userData.data;
                if (userData) {
                    this.setState({
                        sponsoredChallenges: userData.sponsoredChallenges,
                        heldChallenges: userData.heldChallenges
                    });
                }
            })
    }
    challengeList(sponsoredChallenges, heldChallenges) {
        const sponsoredChallengeTiles = sponsoredChallenges.map(function(sponsoredChallenge, index) {
            return ( <div key={index} className="balanceTile">
                <img className="logoImg" src={ncentLogo} alt="ncent logo" />
                <h2 className="balance-subtitle">{sponsoredChallenge.name}</h2>
                <h3 className="balance-subtitle">Sponsored</h3>
                <a
                    title="New"
                    className="initiate-payment-smaller-margin"
                    onClick={this.props.handleInput("formType", {challengeName: sponsoredChallenge.name, challengeUuid: sponsoredChallenge.uuid})}
                >
                    Send
                </a>
                <a
                    title="Redeem"
                    className="initiate-payment"
                    onClick={this.props.redeemChallenge.bind(null, sponsoredChallenge.uuid, this.props.currentUser.email)}
                >
                    Redeem
                </a>
            </div> );
        }.bind(this));
        const heldChallengeTiles = heldChallenges.map(function(heldChallenge, index) {
                return ( <div key={index} className="balanceTile">
                    <img className="logoImg" src={ncentLogo} alt="ncent logo" />
                    <h2 className="balance-subtitle">{heldChallenge.name}</h2>
                    <h3 className="balance-subtitle">Holding</h3>
                    <a
                        title="New"
                        className="initiate-payment"
                        onClick={this.props.handleInput("formType", {challengeName: heldChallenge.name, challengeUuid: heldChallenge.uuid})}
                    >
                        Send
                    </a>
                </div> );
        }.bind(this));
        return (
            <div className="challengesPage">
                <h1 className="challengesHeader">Your jobCents</h1>
                <section className="challengeTiles">{sponsoredChallengeTiles}</section>
                <section className="challengeTiles">{heldChallengeTiles}</section>
            </div>
        );
    }
    render() {
        return (
            this.challengeList(this.state.sponsoredChallenges, this.state.heldChallenges)
        );
    }
}

