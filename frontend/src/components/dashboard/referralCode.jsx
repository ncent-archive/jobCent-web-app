import React from "react";
import "../../scss/components/transfer.css";
import x from "../../img/x.png";
import ncentLogo from "../../img/logo.png";

export default class ReferralCode extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        }

    }

    componentWillMount() {
        document.title = "jobCent - Redeem Code";
        window.history.pushState({}, document.title, window.location.href);
    }

    componentWillUnmount() {
        this.props.removeURLParams();
        this.props.clearErrorMessage();
    }

    render() {
        let close = "";
        if (this.props.closing) {
            close += " fadeOutAnimation";
        }
        return <div className="fs-transfer-sheet">
            <div className="transfer-content">
                {/* <div title="jobCents" className="close-button" onClick={this.props.closeWithDelay}>
                    <img src={x} alt=""/>
                </div> */}
                <form autoComplete="off" className={"transferForm" + close} spellCheck="true" noValidate="true" onSubmit={this.props.redeemReferralCode}>
                    <div className="initiate-transfer">
                        <div className="errorMessage"><span>{this.props.errorMessage}</span></div>
                        <div className="display-amount-fixed">
                            <div className="bottom-margin">
                                <img className="logoImg" src={ncentLogo} alt="ncent logo"/>
                            </div>
                        </div>
                        <div className="enter-email">
                            <div className="recipients">
                                <div className="token-list">
                                    <input className="transfer-input-field" autoComplete="off" spellCheck="false"
                                           placeholder="Referral Code" autoCorrect="false" autoCapitalize="off"
                                           type="text" onChange={this.props.update("referralCode")}
                                           value={this.props.referralCode || ""}
                                           />
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