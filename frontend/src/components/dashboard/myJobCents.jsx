import React from "react";
import ncentLogo from "../../img/logo.png";

export default class MyJobCents extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            balance: []
        };

        this.balanceList = this.balanceList.bind(this);
    }
    componentWillMount() {
        this.props.fetchBalance(this.props.currentUser)
            .then(res => {
                let balance = res.balance.data.balance;
                console.log(res);
                if (balance) {
                    this.setState({
                        balance: balance
                    });
                }
            })
    }
    balanceList(balancesArr) {
        const balanceItems = balancesArr.map((balance, index) =>
            <div key={index} className="balanceTile">
                <img className="logoImg" src={ncentLogo} alt="ncent logo" />
                <h2 className="balance-subtitle">{balance.tokenName}</h2>
                <a
                    title="New"
                    className="initiate-payment"
                    onClick={this.props.handleInput("formType", {tokenTypeUuid: balance.tokenTypeUuid, tokenName: balance.tokenName})}
                >
                    Send
                </a>
            </div>
        );
        return (
            <div className="challengesPage">
                <h1 className="challengesHeader">Your Challenges</h1>
                <section className="challengeTiles">{balanceItems}</section>
            </div>
        );
    }
    render() {
        return (
            this.balanceList(this.state.balance)
        );
    }
}

