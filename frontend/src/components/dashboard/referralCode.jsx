import React from "react";
import "../../scss/components/transfer.css";
import x from "../../img/x.png";
import ncentLogo from "../../img/logo.png";

export default class ReferralCode extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div className="fs-transfer-sheet">
            <div className="transfer-content">
                <div title="jobCents" className="close-button" onClick={this.props.handleInput("formType")}>
                    <img src={x} alt=""/>
                </div>
                <form autoComplete="off" className="transferForm" spellCheck="true" noValidate="true" onSubmit={this.props.redeemReferralCode}>
                    <div className="initiate-transfer">
                        <div className="errorMessage"><span>{this.props.errorMessage}</span></div>
                        <div className="display-amount-fixed">
                            <div className="bottom-margin">
                                <img className="logoImg" src={ncentLogo} alt="ncent logo"/>
                            </div>
                        </div>
                        <div className="enter-email">
                            <div className="recipiens">
                                <div className="token-list">
                                    <input className="transfer-input-field" autoComplete="off" spellCheck="false"
                                           placeholder="Referral Code" autoCorrect="false" autoCapitalize="off"
                                           type="text" onChange={this.props.update("referralCode")}/>
                                </div>
                            </div>
                            <div className="anchor"/>
                            <div className="error-box"/>
                        </div>
                        <button className="theme-button transfer-button">
                            Redeem Code
                        </button>
                        <p className="disclaimerText">Each referral code can only be redeemed once per account</p>
                    </div>
                </form>
            </div>
        </div>;
    }
}