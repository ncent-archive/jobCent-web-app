import React from "react";
import "../../scss/components/transfer.css";
import x from "../../img/x.png";

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
                <form autoComplete="off" spellCheck="true" noValidate="true" onSubmit={this.props.createChallenge}>
                    <div className="initiate-transfer">
                        <div className="errorMessage"><span>{this.props.errorMessage}</span></div>
                        <div className="display-amount-fixed">
                            <div className="bottom-margin">
                                <div className="currency-symbol">Sponsor a jobCent Challenge</div>
                            </div>
                        </div>
                        <div className="sponsorFormCategory">
                            Company Information
                        </div>
                        <div className="enter-email">
                            <div className="recipiens">
                                <div className="token-list">
                                    <input className="transfer-input-field" autoComplete="off" spellCheck="false"
                                           placeholder="Company Name" autoCorrect="false" autoCapitalize="off"
                                           type="text" onChange={this.props.update("company")}/>
                                </div>
                            </div>
                            <div className="anchor"/>
                            <div className="error-box"/>
                        </div>
                        <div className="enter-email">
                            <div className="recipiens">
                                <div className="token-list">
                                    <input className="transfer-input-field" autoComplete="off" spellCheck="false"
                                           placeholder="Company Logo Image URL" autoCorrect="false"
                                           autoCapitalize="off" type="text" onChange={this.props.update("imageUrl")}/>
                                </div>
                            </div>
                            <div className="anchor"/>
                            <div className="error-box"/>
                        </div>
                        <div className="sponsorFormCategory">
                            Job Details
                        </div>
                        <div className="enter-email">
                            <div className="recipiens">
                                <div className="token-list">
                                    <input className="transfer-input-field" autoComplete="off" spellCheck="false"
                                           placeholder="Job Title" autoCorrect="false" autoCapitalize="off" type="text"
                                           onChange={this.props.update("challengeTitle")}/>
                                </div>
                            </div>
                            <div className="anchor"/>
                            <div className="error-box"/>
                        </div>
                        <div className="enter-email">
                            <div className="recipiens">
                                <div className="token-list">
                                    <input className="transfer-input-field" autoComplete="off" spellCheck="false"
                                           placeholder="Job Description" autoCorrect="false" autoCapitalize="off"
                                           type="text" onChange={this.props.update("description")}/>
                                </div>
                            </div>
                            <div className="anchor"/>
                            <div className="error-box"/>
                        </div>
                        <div className="enter-email">
                            <div className="recipiens">
                                <div className="token-list">
                                    <input className="transfer-input-field" autoComplete="off" spellCheck="false"
                                           placeholder="Job Application Link" autoCorrect="false"
                                           autoCapitalize="off" type="text" onChange={this.props.update("participationUrl")}/>
                                </div>
                            </div>
                            <div className="anchor"/>
                            <div className="error-box"/>
                        </div>
                        <div className="sponsorFormCategory">
                            Advanced Settings
                        </div>
                        <div className="enter-email">
                            <div className="recipiens">
                                <div className="token-list">
                                    <input className="transfer-input-field" autoComplete="off" spellCheck="false"
                                           placeholder="Total jobCents (Default of 1000)"
                                           autoCorrect="false" autoCapitalize="off" type="text"
                                           onChange={this.props.update("maxShares")}/>
                                </div>
                            </div>
                            <div className="anchor"/>
                            <div className="error-box"/>
                        </div>
                        <div className="enter-email">
                            <div className="recipiens">
                                <div className="token-list">
                                    <input className="transfer-input-field" autoComplete="off" spellCheck="false"
                                           placeholder="Challenge Duration (days)"
                                           autoCorrect="false" autoCapitalize="off" type="text"
                                           onChange={this.props.update("challengeDuration")}/>
                                </div>
                            </div>
                            <div className="anchor"/>
                            <div className="error-box"/>
                        </div>
                        <div className="enter-email">
                            <div className="recipiens">
                                <div className="token-list">
                                    <input className="transfer-input-field" autoComplete="off" spellCheck="false"
                                           placeholder="Bounty (U.S. Dollars)" autoCorrect="false"
                                           autoCapitalize="off" type="text"
                                           onChange={this.props.update("rewardAmount")}/>
                                </div>
                            </div>
                            <div className="anchor"/>
                            <div className="error-box"/>
                        </div>
                        <div className="agreementContainer">
                            <input type="checkbox" onClick={this.props.handleAgreementCheck}/>
                            <span className="disclaimerText">I agree to pay an amount up to - but not greater than - the bounty amount I have chosen upon each successful hire</span>
                        </div>
                        <button className="theme-button transfer-button">
                            Create Challenge
                        </button>
                    </div>
                </form>
            </div>
        </div>;
    }
}
