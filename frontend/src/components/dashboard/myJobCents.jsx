import React from "react";
import ncentLogo from "../../img/logo.png";

export default class MyJobCents extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            balance: [],
            challenges: [],
            sponsoredChallenges: [],
            transactions: []
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
                        transactions: balance.transactions
                    });
                }
            })
    }
    balanceList(transactions) {
        const balanceItems = transactions.map(function(transaction, index) {
            if (transaction.sponsorUuid === this.props.currentUser.publicKey) {
                return ( <div key={index} className="balanceTile">
                    <img className="logoImg" src={ncentLogo} alt="ncent logo" />
                    <h2 className="balance-subtitle">{transaction.challengeName}</h2>
                    <h3 className="balance-subtitle">Sponsored</h3>
                    <a
                        title="New"
                        className="initiate-payment"
                        onClick={this.props.handleInput("formType", {tokenTypeUuid: transaction.tokenTypeUuid, tokenName: transaction.challengeName, challengeUuid: transaction.uuid})}
                    >
                        Send
                    </a>
                </div> );
            }
            return ( <div key={index} className="balanceTile">
                <img className="logoImg" src={ncentLogo} alt="ncent logo" />
                <h2 className="balance-subtitle">{transaction.challengeName}</h2>
                <h3 className="balance-subtitle">Referral</h3>
                <a
                    title="New"
                    className="initiate-payment"
                    onClick={this.props.handleInput("formType", {tokenTypeUuid: transaction.tokenTypeUuid, tokenName: transaction.challengeName, challengeUuid: transaction.uuid})}
                >
                    Send
                </a>
            </div> );
        }.bind(this));

        return (
            <div className="challengesPage">
                <h1 className="challengesHeader">Your jobCents</h1>
                <section className="challengeTiles">{balanceItems}</section>
            </div>
        );
    }
    render() {
        return (
            this.balanceList(this.state.transactions)
        );
    }
}

