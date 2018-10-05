import React from "react";

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
                if (balance) {
                    this.setState({
                        balance: balance
                    });
                }
            })
    }
    balanceList(balancesArr) {
        const balanceItems = balancesArr.map((balance, index) =>
            <div key={index} className="balance">
                <h1 className="balance-amount">₿{balance.balance}</h1>
                <h2 className="balance-subtitle">{balance.tokenName}</h2>
                <a
                    title="New"
                    className="initiate-payment"
                    onClick={this.props.handleInput("formType")}
                >
                    Send a {balance.tokenName}
                </a>
            </div>
        );
        return (
            <div class="challengesPage">
                <h1 className="challengesHeader">Your Challenges</h1>
                <section className="myJobCents">{balanceItems}</section>
            </div>
        );
    }
    render() {
        return (
            this.balanceList(this.state.balance)
        );
    }
}

