import React from "react";

export default class MyJobCents extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            jobCents: "0"
        }
    }
    componentDidMount() {
        this.props.fetchBalance(this.props.currentUser, this.props.tokenTypeUuid)
            .then(res => {
                console.log("balance fetched#####");
                console.log(res);

                let balance = res.balance.data.balance;
                if (balance) {
                    this.setState({
                        jobCents: balance
                    });
                }
            })
    }
    render() {
        return (
            <section className="myJobCents">
                <div className="balance">
                    <h1 className="balance-amount">₿{this.state.jobCents}</h1>
                    <h2 className="balance-subtitle">jobCents</h2>
                </div>
            </section>
        );
    }
}

