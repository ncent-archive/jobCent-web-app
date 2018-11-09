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
        this.props.leafNodeUsers.forEach((user, index) => {
            radioButtons.push(
                <RadioButton key={index} value={user.publicKey}>
                    {user.email}
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
                <div className="redeemForm">
                    <RadioGroup onChange={this.props.selectRedeemer} horizontal={false}>
                        {this.radioButtons()}
                    </RadioGroup>
                    <button className="theme-button transfer-button redeem-button" onClick={() => {
                        this.props.handleRedeem(this.props.challengeDetails.uuid, this.props.currentUser.email)
                    }}>
                        Redeem
                    </button>
                </div>
            </div>
        </div>;
    }
}
