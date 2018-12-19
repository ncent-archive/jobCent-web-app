import React from "react";
import "../../scss/components/transfer.css";
import x from "../../img/x.png";
import {RadioGroup, RadioButton} from 'react-radio-buttons';

export default class Redeem extends React.Component {
    constructor(props) {
        super(props);

        this.radioButtons = this.radioButtons.bind(this);
    }

    componentWillMount() {
        document.title = "jobCent - Redeem Challenge";
        window.history.pushState({}, document.title, window.location.href);
    }

    radioButtons() {
        let radioButtons = [];
        this.props.challengeUsers.forEach((user, index) => {
            radioButtons.push(
                <RadioButton key={index} value={user.publicKey}>
                    {user.email}
                </RadioButton>
            );
        });
        return radioButtons;
    }

    render() {
        let close = "";
        if (this.props.closing) {
            close += " fadeOutAnimation";
        }
        return <div className="fs-transfer-sheet">
            <div className="transfer-content">
                <div title="jobCents" className="close-button" onClick={this.props.closeWithDelay}>
                    <img src={x} alt=""/>
                </div>
                <div className={"redeemForm" + close}>
                    <div className="display-amount-fixed">
                        <div className="bottom-margin">
                            <div className="currency-symbol">Redeem Your jobCent Challenge</div>
                        </div>
                    </div>
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
