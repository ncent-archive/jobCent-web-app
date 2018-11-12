import React from "react";
import "../../scss/components/transfer.css";
import x from "../../img/x.png";
import ncentLogo from "../../img/logo.png";


export default class Transfer extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div className="fs-transfer-sheet">
            <div className="transfer-content">
                <div title="jobCents" className="close-button" onClick={this.props.handleInput("formType")}>
                    <img src={x} alt=""/>
                </div>
                <form autoComplete="off" className="transferForm" spellCheck="true" noValidate="true" onSubmit={this.props.handleTransfer}>
                    <div className="initiate-transfer">
                        <span className="errorMessage">{this.props.errorMessage}</span>
                        <div className="display-amount-fixed">
                            <div className="bottom-margin">
                                <img className="logoImg" src={this.props.imageUrl || ncentLogo} alt="ncent logo"/>
                            </div>
                        </div>
                        <div className="enter-email">
                            <label htmlFor="">To:</label>
                            <div className="recipiens">
                                <div className="token-list">
                                    <input className="transfer-input-field" autoComplete="off" spellCheck="false"
                                           placeholder="Email address" autoCorrect="false" autoCapitalize="off"
                                           type="text" onChange={this.props.update("toAddress")}/>
                                </div>
                            </div>
                            <div className="anchor"/>
                            <div className="error-box"/>
                        </div>
                        <div className="enter-email">
                            <label htmlFor="">To:</label>
                            <div className="recipiens">
                                <div className="token-list">
                                    <input className="transfer-input-field" autoComplete="off" spellCheck="false"
                                           placeholder="Number of jobCents to Send" autoCorrect="false" autoCapitalize="off"
                                           type="text" onChange={this.props.update("numShares")}/>
                                </div>
                            </div>
                            <div className="anchor"/>
                            <div className="error-box"/>
                        </div>
                        <button className="theme-button transfer-button">
                            Send {this.props.challengeName}
                        </button>
                        <p className="disclaimerText">*Please note that rewards can only be redeemed if you have a jobCent balance greater than zero for the challenge you get hired for.</p>
                    </div>
                </form>
            </div>
        </div>;
    }
}
