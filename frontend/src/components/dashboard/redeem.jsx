import React from "react";
import "../../scss/components/transfer.css";
import x from "../../img/x.png";
import {RadioGroup, RadioButton} from 'react-radio-buttons';

export default class Redeem extends React.Component {
    constructor(props) {
        super(props);

        this.radioButtons = this.radioButtons.bind(this);
    }

    radioButtons() {
        let radioButtons = [];
        this.props.leafNodeTransactions.forEach(transaction => {
            radioButtons.push(
                <RadioButton value={transaction.toAddress}>
                    {transaction.toAddress}
                </RadioButton>
            );
        });
        return radioButtons;
    }

    render() {
        return <div className="fs-transfer-sheet">
            <div className="transfer-content">
                <div title="jobCents" className="close-button" onClick={this.props.handleInput("formType")}>
                    <img src={x} alt=""/>
                </div>
                <RadioGroup onChange={this.props.update("redeemAddress")} horizontal={false}>
                    {this.radioButtons()}
                </RadioGroup>
                <button className="theme-button transfer-button" onClick={() => {
                    this.props.redeemChallenge(this.props.challengeDetails.uuid, this.props.currentUser.publicKey)
                }}>
                    Redeem
                </button>
            </div>
        </div>;
    }
}
