import React from "react";
import ncentLogo from "../../img/logo.png";

export default class MyJobCents extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            balance: [],
            challenges: [],
            sponsoredChallenges: [],
            challengesHeld: []
        };

        this.balanceList = this.balanceList.bind(this);
    }
    componentWillMount() {
        this.props.fetchBalance(this.props.currentUser)
            .then(res => {
                let balance = res.balance.data;
                if (balance) {
                    this.setState({
                        balance: balance.balance,
                        challenges: balance.challenges,
                        sponsoredChallenges: balance.sponsoredChallenges,
                        challengesHeld: balance.challengesHeld
                    });
                }
            })
    }
    balanceList(challenges, sponsoredChallengeIds, challengesHeldIds) {
        const balanceItems = challenges.map(function(challenge, index) {
            if (challenge.sponsorUuid === this.props.currentUser.publicKey) {
                return ( <div key={index} className="balanceTile">
                    <img className="logoImg" src={ncentLogo} alt="ncent logo" />
                    <h2 className="balance-subtitle">{challenge.name}</h2>
                    <h3 className="balance-subtitle">Sponsored</h3>
                    <a
                        title="New"
                        className="initiate-payment"
                        onClick={this.props.handleInput("formType", {tokenTypeUuid: challenge.tokenTypeUuid, tokenName: challenge.name})}
                    >
                        Send
                    </a>
                </div> );
            } else if (challengesHeldIds.includes(challenge.uuid)) {
                return ( <div key={index} className="balanceTile">
                    <img className="logoImg" src={ncentLogo} alt="ncent logo" />
                    <h2 className="balance-subtitle">{challenge.name}</h2>
                    <h3 className="balance-subtitle">Current</h3>
                    <a
                        title="New"
                        className="initiate-payment"
                        onClick={this.props.handleInput("formType", {tokenTypeUuid: challenge.tokenTypeUuid, tokenName: challenge.name})}
                    >
                        Send
                    </a>
                </div> );
            }
            return ( <div key={index} className="balanceTile">
                <img className="logoImg" src={ncentLogo} alt="ncent logo" />
                <h2 className="balance-subtitle">{challenge.name}</h2>
                <h3 className="balance-subtitle">Referred</h3>
                <a
                    title="New"
                    className="initiate-payment"
                    onClick={this.props.handleInput("formType", {tokenTypeUuid: challenge.tokenTypeUuid, tokenName: challenge.name})}
                >
                    Send
                </a>
            </div> );
        }.bind(this));

        return (
            <div className="challengesPage">
                <h1 className="challengesHeader">Your Challenges</h1>
                <section className="challengeTiles">{balanceItems}</section>
            </div>
        );
    }
    render() {
        return (
            this.balanceList(this.state.challenges, this.state.sponsoredChallenges.map(challenge => challenge.uuid), this.state.challengesHeld.map(challenge => challenge.uuid))
        );
    }
}

